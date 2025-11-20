import sys
import json
import os
import warnings

warnings.filterwarnings('ignore')

sys.stderr = open(os.devnull, 'w')

from PIL import Image
import img2pdf

def convert_images_to_pdf(image_paths, output_path):
    try:
        valid_images = []
        for img_path in image_paths:
            if os.path.exists(img_path):
                valid_images.append(img_path)
            else:
                return False, f'Image file not found: {img_path}'
        
        if not valid_images:
            return False, 'No valid images provided'
        
        with open(output_path, "wb") as f:
            f.write(img2pdf.convert(valid_images))
        
        return True, f"Successfully converted {len(valid_images)} image(s) to PDF"
    except Exception as e:
        return False, str(e)

def main():
    try:
        if len(sys.argv) < 3:
            result = {
                'success': False,
                'error': 'Missing arguments: image_paths_json and output_path required'
            }
            print(json.dumps(result), flush=True)
            sys.exit(1)
        
        try:
            image_paths = json.loads(sys.argv[1])
        except json.JSONDecodeError:
            result = {
                'success': False,
                'error': 'Invalid JSON for image paths'
            }
            print(json.dumps(result), flush=True)
            sys.exit(1)
        
        output_path = sys.argv[2]
        
        success, message = convert_images_to_pdf(image_paths, output_path)
        
        result = {
            'success': success,
            'message': message,
            'output_file': output_path if success else None
        }
        
        print(json.dumps(result), flush=True)
    except Exception as e:
        result = {
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }
        print(json.dumps(result), flush=True)
        sys.exit(1)

if __name__ == '__main__':
    main()
