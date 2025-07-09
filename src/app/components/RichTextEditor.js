'use client';

import React, { useState, useEffect } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);
  const [editorContent, setEditorContent] = useState(value || '');
  
  useEffect(() => {
    setMounted(true);
    setEditorContent(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setEditorContent(newValue);
    onChange(newValue);
  };

  // Simple formatting functions
  const insertFormatting = (startTag, endTag) => {
    const textarea = document.getElementById('simple-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    const beforeText = editorContent.substring(0, start);
    const afterText = editorContent.substring(end);

    const newContent = beforeText + startTag + selectedText + endTag + afterText;
    setEditorContent(newContent);
    onChange(newContent);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length, 
        start + startTag.length + selectedText.length
      );
    }, 10);
  };

  if (!mounted) {
    return (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={15}
        style={{
          width: '100%',
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '16px',
          fontFamily: 'inherit',
          resize: 'vertical'
        }}
        placeholder="Write your complete cannabis blog post content here. Share your knowledge, experiences, and insights with the GreenBritain.Club community..."
      />
    );
  }

  return (
    <div className="simple-rich-text-editor">
      <div className="toolbar" style={{
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(34, 197, 94, 0.3)',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        padding: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <button 
          type="button" 
          onClick={() => insertFormatting('<h1>', '</h1>')}
          style={buttonStyle}
          title="Heading 1"
        >
          H1
        </button>
        <button 
          type="button" 
          onClick={() => insertFormatting('<h2>', '</h2>')}
          style={buttonStyle}
          title="Heading 2"
        >
          H2
        </button>
        <button 
          type="button" 
          onClick={() => insertFormatting('<h3>', '</h3>')}
          style={buttonStyle}
          title="Heading 3"
        >
          H3
        </button>
        <span style={{ width: '1px', background: 'rgba(34, 197, 94, 0.3)', margin: '0 4px' }}></span>
        <button 
          type="button" 
          onClick={() => insertFormatting('<strong>', '</strong>')}
          style={buttonStyle}
          title="Bold"
        >
          B
        </button>
        <button 
          type="button" 
          onClick={() => insertFormatting('<em>', '</em>')}
          style={buttonStyle}
          title="Italic"
        >
          I
        </button>
        <button 
          type="button" 
          onClick={() => insertFormatting('<u>', '</u>')}
          style={buttonStyle}
          title="Underline"
        >
          U
        </button>
        <span style={{ width: '1px', background: 'rgba(34, 197, 94, 0.3)', margin: '0 4px' }}></span>
        <button 
          type="button" 
          onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
          style={buttonStyle}
          title="Bullet List"
        >
          • List
        </button>
        <button 
          type="button" 
          onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
          style={buttonStyle}
          title="Numbered List"
        >
          1. List
        </button>
        <button 
          type="button" 
          onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
          style={buttonStyle}
          title="Quote"
        >
          " Quote
        </button>
        <button 
          type="button" 
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) insertFormatting(`<a href="${url}" target="_blank">`, '</a>');
          }}
          style={buttonStyle}
          title="Insert Link"
        >
          🔗 Link
        </button>
      </div>
      
      <textarea
        id="simple-editor"
        value={editorContent}
        onChange={handleChange}
        rows={15}
        style={{
          width: '100%',
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          border: 'none',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          color: 'white',
          fontSize: '16px',
          fontFamily: 'inherit',
          resize: 'vertical',
          minHeight: '350px',
          outline: 'none'
        }}
        placeholder="Write your complete cannabis blog post content here. Share your knowledge, experiences, and insights with the GreenBritain.Club community..."
      />
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#86efac' }}>
        <p>💡 <strong>HTML Formatting:</strong> You can use HTML tags for advanced formatting.</p>
      </div>
    </div>
  );
}

// Button style
const buttonStyle = {
  padding: '6px 12px',
  background: 'rgba(0,0,0,0.3)',
  color: '#86efac',
  border: '1px solid rgba(34, 197, 94, 0.3)',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
}; 