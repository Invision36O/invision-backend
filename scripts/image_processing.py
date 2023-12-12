import cv2
import sys
import os
import logging
import numpy as np
import json
import re
from pytesseract import pytesseract

pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

logging.basicConfig(filename='image_processing5.log', level=logging.DEBUG)

def enhance_image(image):
    enhanced = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    logging.info("Enhancing image")
    return enhanced

def remove_multiple_dimensions(room_data):
    return {room: {"dimensions": {
                    "width": int(re.sub(r'\D', '', data["dimensions"][0])),
                    "depth": int(re.sub(r'\D', '', data["dimensions"][1])),
                    "height": 1.2
                },
                "position": data["position"]
            } for room, data in room_data.items()}

def image_processing(image, input_image_filename):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    enhanced = enhance_image(gray)
  
    contours, _ = cv2.findContours(enhanced, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours, bounding_boxes = zip(*sorted(zip(contours, [cv2.boundingRect(c) for c in contours]),
                                            key=lambda b: b[1][1], reverse=False))

    room_data = {}

    for contour, (x, y, w, h) in zip(contours, bounding_boxes):
        if w * h < 100:
            continue
        
        cropped_image = gray[y:y+h, x:x+w]
        text = pytesseract.image_to_string(cropped_image, config='--psm 6 --oem 3').strip().split('\n')

        room_name = text[0] if text else None
        dimensions = text[1] if len(text) > 1 and 'x' in text[1] else None
        
        if room_name and len(room_name) > 2 and not any(char.isdigit() for char in room_name):
            room_data[room_name.strip()] = {
                "dimensions": [value for value in re.split(r'\D', dimensions) if value],  # Split by non-digit characters
                "position": {"x": x, "y": y}
            }

    room_data = remove_multiple_dimensions(room_data)

    json_path = os.path.abspath(os.path.join(__file__, '..', '..', 'public', 'spaceData', f"{input_image_filename}_room_data.json"))
    
    with open(json_path, "w") as json_file:
        json.dump({"rooms": room_data}, json_file)

    return image

try:
    if len(sys.argv) != 2:
        raise ValueError("Usage: python image_processing.py <input_image_filename>")

    input_image_filename = sys.argv[1]
    logging.info(f"Processing image: {input_image_filename}")

    input_image_path = os.path.join('C://Users//engss//Desktop//FYP//invision-backend//public//uploadedImages', input_image_filename)

    if not os.path.isfile(input_image_path):
        raise FileNotFoundError(f"Image not found: {input_image_path}")

    input_image = cv2.imread(input_image_path)
    logging.info("Reading image")
    processed_image = image_processing(input_image, input_image_filename)

    file, ext = os.path.splitext(input_image_filename)
    output_filename = "processed_" + file + ext
    output_path = os.path.join('C://Users//engss//Desktop//FYP//invision-backend//public//processedImages', output_filename)
    cv2.imwrite(output_path, processed_image)
    logging.info("Saving image")
except Exception as e:
    logging.error(f"Error during image processing: {str(e)}")
