const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join(__dirname, 'src/components/MarketplaceDashboard.tsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Fix the first issue: Replace T extends unknown with just T,
// Adding a trailing comma is a valid TypeScript syntax for generic parameters
content = content.replace(
  /const getData = <T extends unknown>\(/g, 
  'const getData = <T,>('
);

// Fix the second issue: Remove the explicit any type
content = content.replace(
  /{supplyDemandData.map\(\(entry: any, index: number\) =>/g,
  '{supplyDemandData.map((entry, index) =>'
);

// Write the fixed content back to the file
fs.writeFileSync(filePath, content);

console.log('Fixed ESLint issues in MarketplaceDashboard.tsx');
