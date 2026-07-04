const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('firstName')) {
    // getInitials(emp.firstName, emp.lastName) -> getInitials(emp.name || emp.firstName, emp.lastName)
    content = content.replace(/getInitials\(([^,]+)\.firstName,\s*([^)]+)\.lastName\)/g, "getInitials($1.name || $1.firstName, $2.lastName)");
    
    // ${emp.firstName} ${emp.lastName} -> ${emp.name || emp.firstName + ' ' + emp.lastName}
    content = content.replace(/\$\{([^}]+)\.firstName\}\s*\$\{([^}]+)\.lastName\}/g, "${$1.name || `$1.firstName $1.lastName`}");
    
    // {emp.firstName} {emp.lastName} -> {emp.name || `${emp.firstName} ${emp.lastName}`}
    content = content.replace(/\{([^}]+)\.firstName\}\s*\{([^}]+)\.lastName\}/g, "{$1.name || `$1.firstName $1.lastName`}");

    // Welcome back, {employee.firstName} -> Welcome back, {employee.name?.split(' ')[0] || employee.firstName}
    content = content.replace(/\{([^}]+)\.firstName\}/g, "{$1.name?.split(' ')[0] || $1.firstName}");

    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
