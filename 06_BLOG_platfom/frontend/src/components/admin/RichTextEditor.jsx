import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing your article...' }) => {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        [{ font: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    },
    clipboard: { matchVisual: false },
  }), []);

  const formats = [
    'header', 'font', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'blockquote', 'code-block',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'video',
  ];

  return (
    <div className="rich-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      />
    </div>
  );
};

export default RichTextEditor;