const express = require('express');
const fileUpload = require('express-fileupload');
const mammoth = require('mammoth');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

const app = express();

// Enable file upload middleware
app.use(fileUpload());

// POST route to handle file uploads
app.post('/convert', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const docxFile = req.files.file; // The uploaded file

  // Set the upload path to save in 'uploads' directory
  const uploadPath = path.join(__dirname, 'uploads', docxFile.name);

  // Save the uploaded file
  docxFile.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    // Convert DOCX to HTML using Mammoth
    mammoth.convertToHtml({ path: uploadPath })
      .then(result => {
        const html = result.value; // Get the HTML content from DOCX
        const options = { format: 'Letter' };

        // Convert the HTML to PDF
        pdf.create(html, options).toStream((err, stream) => {
          if (err) return res.status(500).send(err);

          // Set PDF response headers
          res.setHeader('Content-Type', 'application/pdf');
          stream.pipe(res); // Send the PDF file to the client
        });
      })
      .catch(err => res.status(500).send('Error during conversion: ' + err));
  });
});

// Start the server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
