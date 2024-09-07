import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/convert', {
        method: 'POST',
        body: formData,
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted-file.pdf'); // You can customize the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error during file upload:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Convert your files for free here!</h1>
      </header>

      <main>
        <h2>Upload your files here!</h2>

        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} accept=".doc,.docx" />
          <br />
          <input type="submit" value="Convert File" />
        </form>
      </main>

      <footer>Built by <a href="https://devchhatbar.com">dev</a></footer>
    </div>
  );
}

export default App;
