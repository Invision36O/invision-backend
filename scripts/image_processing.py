import cv2
import sys
import os
import logging
import json
import re
from pytesseract import pytesseract

# Set up Tesseract command path and logging
pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
logging.basicConfig(filename='image_processing.log', level=logging.DEBUG)

# Initialize variables for room positioning
current_x, current_z, total_width_of_previous_row, previous_room_depth = 0, 0, 0, 0
last_row_y = -1
first_room_skipped = False

def enhance_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blur, 200, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    return thresh

def sort_contours(contours):
    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    return sorted(zip(contours, bounding_boxes), key=lambda b: (b[1][1], b[1][0]))

def parse_dimensions(dimensions_str):
    width, depth = map(int, dimensions_str.lower().replace('x', ' ').split())
    return {"width": width, "depth": depth, "height": 1.2}

def calculate_relative_position(x, y, w, h):
    global current_x, current_z, total_width_of_previous_row, previous_room_depth, last_row_y,  first_room_skipped

    if not first_room_skipped:
        # Skip the first room and don't update any positions
        first_room_skipped = True
        return None

    # Check if we are on a new row by comparing the y coordinate
    if y > last_row_y + previous_room_depth:
        # We are on a new row
        last_row_y = y
        current_x = total_width_of_previous_row  # Set the x position to the total width of the previous row
        current_z = 0  # Reset z position for a new row
        total_width_of_previous_row += w  # Update the total width of the previous row
    else:
        # We are in the same row
        current_z += previous_room_depth  # Increase z position by the depth of the previous room

    previous_room_depth = h  # Update the depth of the previous room for the next iteration

    return {"x": current_x, "z": current_z}

def image_processing(image, input_image_filename):
    global current_x, current_z, total_width_of_previous_row, previous_room_depth, last_row_y
    current_x, current_z, total_width_of_previous_row, previous_room_depth, last_row_y = 0, 0, 0, 0, 0

    enhanced = enhance_image(image)
    contours, _ = cv2.findContours(enhanced, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(image, contours, -1, (0, 255, 0), 3)
    sorted_contours = sort_contours(contours)

    room_data = {}

    for contour, bounding in sorted_contours:
        x, y, w, h = bounding
        if w * h < 100:  # Skip small contours
            continue
        
        cropped_image = enhanced[y:y+h, x:x+w]
        text = pytesseract.image_to_string(cropped_image, config='--psm 6').strip()
        logging.info(f"Detected text: {text}")
        
        match = re.search(r'([A-Za-z\s]+)\s+(\d+\s*x\s*\d+)', text)
        if match:
            room_name, dimensions_str = match.groups()
            room_name = room_name.strip()
            logging.info(f"Room detected: {room_name}")

            parsed_dimensions = parse_dimensions(dimensions_str)
            position = calculate_relative_position(x, y, parsed_dimensions["width"], parsed_dimensions["depth"])

            if position:  # Only add the room if a position was calculated
                room_data[room_name] = {
                    "dimensions": parsed_dimensions,
                    "position": position
                }

    # Sort the rooms based on their positions
    sorted_rooms = sorted(room_data.items(), key=lambda x: (x[1]["position"]["x"], x[1]["position"]["z"]))

    # Create a new ordered dictionary with the sorted rooms
    ordered_room_data = dict(sorted_rooms)

    json_path = os.path.join('C://Users//engss//Desktop//FYP//invision-backend//public//spaceData', f"{os.path.splitext(input_image_filename)[0]}.json")

    with open(json_path, "w") as json_file:
        json.dump({"rooms": ordered_room_data}, json_file, indent=4)

    return image

# Main execution
if __name__ == "__main__":
    try:
        if len(sys.argv) != 2:
            raise ValueError("Usage: python image_processing.py <input_image_filename>")
        input_image_filename = sys.argv[1]

        input_image_path = os.path.join('C://Users//engss//Desktop//FYP//invision-backend//public//uploadedImages', input_image_filename)

        if not os.path.isfile(input_image_path):
            raise FileNotFoundError(f"Image not found: {input_image_path}")
        image = cv2.imread(input_image_path)
        processed_image = image_processing(image, input_image_filename)
        output_filename = f"processed_{input_image_filename}"

        output_path = os.path.join('C://Users//engss//Desktop//FYP//invision-backend//public//processedImages', output_filename)

        cv2.imwrite(output_path, processed_image)
        logging.info(f"Processed image saved at {output_path}")
    except Exception as e:
        logging.exception("An error occurred while processing the image.")
        sys.exit(str(e))