import sys
import json
import os
import warnings
import logging

warnings.filterwarnings('ignore')

import logging
logging.basicConfig(level=logging.CRITICAL)
logging.getLogger().setLevel(logging.CRITICAL)

from pdf2docx import Converter

def convert_pdf_to_word(pdf_path, output_path):
    try:
        cv = Converter(pdf_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()
        return True, "Conversion successful"
    except Exception as e:
        return False, str(e)

def main():
    try:
        if len(sys.argv) < 3:
            result = {
                'success': False,
                'error': 'Missing arguments: pdf_path and output_path required'
            }
            print(json.dumps(result), flush=True)
            sys.exit(1)
        
        pdf_path = sys.argv[1]
        output_path = sys.argv[2]
        
        if not os.path.exists(pdf_path):
            result = {
                'success': False,
                'error': f'PDF file not found: {pdf_path}'
            }
            print(json.dumps(result), flush=True)
            sys.exit(1)
        
        success, message = convert_pdf_to_word(pdf_path, output_path)
        
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
