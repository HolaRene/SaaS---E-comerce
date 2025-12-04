const nextVersion = require('next/package.json').version
const reactVersion = require('react/package.json').version

console.log('✅ Next.js:', nextVersion)
console.log('✅ React:', reactVersion)

const vulnerable =
  nextVersion.includes('15.5.0') ||
  nextVersion.includes('15.5.1') ||
  nextVersion.includes('15.5.2') ||
  nextVersion.includes('15.5.3') ||
  nextVersion.includes('15.5.4') ||
  nextVersion.includes('15.5.5') ||
  nextVersion.includes('15.5.6')

if (vulnerable) {
  console.error('❌ AÚN VULNERABLE - Actualización fallida')
  process.exit(1)
} else {
  console.log('🛡️ VERSIÓN SEGURA')
}
