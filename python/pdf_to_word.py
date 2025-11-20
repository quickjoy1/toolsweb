import sys
import json
import os
from pdf2docx import Converter

def convert_pdf_to_word(pdf_path, output_path):
    try:
        cv = Converter(pdf_path)
        cv.convert(output_path)
        cv.close()
        return True, "Conversion successful"
    except Exception as e:
        return False, str(e)

def main():
    if len(sys.argv) < 3:
        result = {
            'success': False,
            'error': 'Missing arguments: pdf_path and output_path required'
        }
        print(json.dumps(result))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    output_path = sys.argv[2]
    
    if not os.path.exists(pdf_path):
        result = {
            'success': False,
            'error': f'PDF file not found: {pdf_path}'
        }
        print(json.dumps(result))
        sys.exit(1)
    
    success, message = convert_pdf_to_word(pdf_path, output_path)
    
    result = {
        'success': success,
        'message': message,
        'output_file': output_path if success else None
    }
    
    print(json.dumps(result))

if __name__ == '__main__':
    main()
