import cv2
import sys
import os
import logging
import numpy as np
import json

# Setup logging
logging.basicConfig(filename='image_processing5.log', level=logging.DEBUG)

from pytesseract import pytesseract

# Configure the path to the Tesseract executable
pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def enhance_image(image):
    # Apply adaptive thresholding
    enhanced = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    logging.info(f"Enhancing image")
    return enhanced

def image_processing(image, input_image_filename):
    # Convert image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Enhance the image
    enhanced = enhance_image(gray)

    # Detect contours
    contours, _ = cv2.findContours(enhanced, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(image, contours, -1, (0, 255, 0), 1)

    room_data = {}  # Using a dictionary to store room names and their dimensions
    
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w * h < 100:  # Threshold to ignore small contours; you might need to adjust this
            continue
        
        cropped_image = gray[y:y+h, x:x+w]
        
        # Use PyTesseract with enhanced settings
        text = pytesseract.image_to_string(cropped_image, config='--psm 6 --oem 3').strip().split('\n')
        
        # Assuming that the first line is the room name and the second line (if exists) contains dimensions
        room_name = text[0] if text else None
        dimensions = text[1] if len(text) > 1 and 'x' in text[1] else None  # Checking for the 'x' pattern
        
        # Filter out noisy/short room names
        if room_name and len(room_name) > 2 and not any(char.isdigit() for char in room_name):
            room_data[room_name] = dimensions
            
    json_path = f"{input_image_filename}_room_data.json"
    
    with open(json_path, "w") as json_file:
        json.dump({"rooms": room_data}, json_file)

    return image




try:
    if len(sys.argv) != 2:
        raise ValueError("Usage: python image_processing.py <input_image_filename>")

    input_image_filename = sys.argv[1]
    logging.info(f"Processing image: {input_image_filename}")

    input_image_path = os.path.join('C://Users/Dell/Desktop/Invision360/invision-backend/public', input_image_filename)

    if not os.path.isfile(input_image_path):
        raise FileNotFoundError(f"Image not found: {input_image_path}")

    # Read the image
    input_image = cv2.imread(input_image_path)
    logging.info(f"Reading image")
    # Process the image
    processed_image = image_processing(input_image, input_image_filename)

    # Save the processed image
    file, ext = os.path.splitext(input_image_filename)
    output_filename = "processed_" + file + ext
    output_path = os.path.join("C://Users/Dell/Desktop/Invision360/invision-backend/public", output_filename)
    cv2.imwrite(output_path, processed_image)
    logging.info(f"Saving image")
except Exception as e:
    logging.error(f"Error during image processing: {str(e)}")


