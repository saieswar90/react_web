const markdownpdf = require('markdown-pdf');
const path = require('path');

const inputFile = path.join(__dirname, 'Project_Report.md');
const outputFile = path.join(__dirname, 'Project_Report.pdf');

markdownpdf()
  .from(inputFile)
  .to(outputFile, () => {
    console.log(`PDF generated successfully at: ${outputFile}`);
  })
  .on('error', (err) => {
    console.error('Error generating PDF:', err);
  });
