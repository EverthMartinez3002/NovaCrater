#!/usr/bin/env node

/**
 * Dashboard Test Suite Runner
 * 
 * This script runs all dashboard tests in order and generates comprehensive reports.
 * It's designed to be executed from the project root.
 * 
 * Usage:
 *   node cypress/e2e/dashboard/run-dashboard-tests.js [options]
 * 
 * Options:
 *   --headless     Run tests in headless mode (default: true)
 *   --browser      Browser to use (default: chrome)
 *   --parallel     Run tests in parallel (default: false)
 *   --env          Environment to test (default: local)
 *   --record       Record tests to Cypress Dashboard
 *   --spec         Run specific test file
 *   --tags         Run tests with specific tags
 * 
 * Examples:
 *   node cypress/e2e/dashboard/run-dashboard-tests.js
 *   node cypress/e2e/dashboard/run-dashboard-tests.js --browser firefox --env staging
 *   node cypress/e2e/dashboard/run-dashboard-tests.js --spec "01-dashboard-load"
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES module equivalent of __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  headless: !args.includes('--headed'),
  browser: getArgValue('--browser') || 'chrome',
  parallel: args.includes('--parallel'),
  env: getArgValue('--env') || 'local',
  record: args.includes('--record'),
  spec: getArgValue('--spec'),
  tags: getArgValue('--tags'),
};

function getArgValue(arg) {
  const index = args.indexOf(arg);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
}

// Test suite configuration
const TEST_SUITES = {
  'dashboard-core': [
    'cypress/e2e/dashboard/01-dashboard-load.cy.js',
    'cypress/e2e/dashboard/02-date-filtering.cy.js'
  ],
  'dashboard-table': [
    'cypress/e2e/dashboard/03-table-operations.cy.js'
  ],
  'dashboard-export': [
    'cypress/e2e/dashboard/04-export-functionality.cy.js'
  ],
  'dashboard-charts': [
    'cypress/e2e/dashboard/05-charts-integration.cy.js'
  ]
};

// Test execution order for full suite
const EXECUTION_ORDER = [
  'dashboard-core',
  'dashboard-table', 
  'dashboard-export',
  'dashboard-charts'
];

console.log('🚀 Starting Dashboard Test Suite');
console.log('='.repeat(50));
console.log(`Browser: ${options.browser}`);
console.log(`Mode: ${options.headless ? 'Headless' : 'Headed'}`);
console.log(`Environment: ${options.env}`);
console.log(`Parallel: ${options.parallel}`);
console.log('='.repeat(50));

async function runTestSuite() {
  const startTime = Date.now();
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const results = {};

  try {
    // Ensure required directories exist
    ensureDirectoriesExist();

    // Run specific spec if provided
    if (options.spec) {
      console.log(`🎯 Running specific test: ${options.spec}`);
      await runSingleTest(options.spec);
      return;
    }

    // Run test suites in order
    for (const suiteName of EXECUTION_ORDER) {
      console.log(`\n📋 Running ${suiteName} tests...`);
      console.log('-'.repeat(30));

      const suiteResults = await runTestSuite_Internal(suiteName);
      results[suiteName] = suiteResults;
      
      totalTests += suiteResults.total;
      passedTests += suiteResults.passed;
      failedTests += suiteResults.failed;

      // Stop on first failure unless parallel mode
      if (suiteResults.failed > 0 && !options.parallel) {
        console.log(`❌ Test suite ${suiteName} failed. Stopping execution.`);
        break;
      }
    }

    // Generate summary report
    generateSummaryReport({
      totalTests,
      passedTests,
      failedTests,
      results,
      duration: Date.now() - startTime
    });

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

async function runTestSuite_Internal(suiteName) {
  const specs = TEST_SUITES[suiteName];
  let total = 0;
  let passed = 0;
  let failed = 0;

  for (const spec of specs) {
    console.log(`  🧪 Running ${path.basename(spec)}...`);
    
    try {
      const result = await runCypressSpec(spec);
      total += result.totalTests;
      passed += result.totalPassed;
      failed += result.totalFailed;
      
      console.log(`    ✅ ${result.totalPassed} passed, ❌ ${result.totalFailed} failed`);
    } catch (error) {
      console.log(`    ❌ Spec failed: ${error.message}`);
      failed++;
    }
  }

  return { total, passed, failed };
}

async function runSingleTest(specPattern) {
  const matchingSpecs = findMatchingSpecs(specPattern);
  
  if (matchingSpecs.length === 0) {
    console.log(`❌ No tests found matching: ${specPattern}`);
    return;
  }

  for (const spec of matchingSpecs) {
    console.log(`🧪 Running ${spec}...`);
    await runCypressSpec(spec);
  }
}

function findMatchingSpecs(pattern) {
  const allSpecs = Object.values(TEST_SUITES).flat();
  return allSpecs.filter(spec => 
    spec.includes(pattern) || path.basename(spec).includes(pattern)
  );
}

async function runCypressSpec(spec) {
  const cypressCommand = buildCypressCommand(spec);
  
  try {
    const output = execSync(cypressCommand, { 
      encoding: 'utf8',
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    return parseCypressOutput(output);
  } catch (error) {
    // Cypress returns non-zero exit code on test failures
    const output = error.stdout || error.message;
    return parseCypressOutput(output);
  }
}

function buildCypressCommand(spec) {
  let command = 'npx cypress run';
  
  command += ` --spec "${spec}"`;
  command += ` --browser ${options.browser}`;
  
  if (options.headless) {
    command += ' --headless';
  }
  
  if (options.env !== 'local') {
    command += ` --env ENVIRONMENT=${options.env}`;
  }
  
  if (options.record) {
    command += ' --record';
  }
  
  // Add reporting
  command += ' --reporter json';
  command += ' --reporter-options "output=cypress/results/dashboard-results.json"';
  
  return command;
}

function parseCypressOutput(output) {
  // Parse Cypress JSON output for test results
  const defaultResult = { totalTests: 1, totalPassed: 0, totalFailed: 1 };
  
  try {
    // Look for test results in output
    const lines = output.split('\n');
    let passed = 0;
    let failed = 0;
    
    lines.forEach(line => {
      if (line.includes('passing')) {
        const match = line.match(/(\d+) passing/);
        if (match) passed = parseInt(match[1]);
      }
      if (line.includes('failing')) {
        const match = line.match(/(\d+) failing/);
        if (match) failed = parseInt(match[1]);
      }
    });
    
    return {
      totalTests: passed + failed,
      totalPassed: passed,
      totalFailed: failed
    };
  } catch (error) {
    console.warn('Could not parse Cypress output, using defaults');
    return defaultResult;
  }
}

function ensureDirectoriesExist() {
  const dirs = [
    'cypress/results',
    'cypress/screenshots',
    'cypress/videos',
    'cypress/downloads'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function generateSummaryReport(summary) {
  console.log('\n' + '='.repeat(50));
  console.log('📊 DASHBOARD TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${summary.totalTests}`);
  console.log(`✅ Passed: ${summary.passedTests}`);
  console.log(`❌ Failed: ${summary.failedTests}`);
  console.log(`⏱️  Duration: ${formatDuration(summary.duration)}`);
  console.log(`📈 Success Rate: ${((summary.passedTests / summary.totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Suite Breakdown:');
  Object.entries(summary.results).forEach(([suite, result]) => {
    const status = result.failed > 0 ? '❌' : '✅';
    console.log(`  ${status} ${suite}: ${result.passed}/${result.total} passed`);
  });
  
  // Write detailed report to file
  const reportPath = 'cypress/results/dashboard-summary.json';
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`\n📝 Detailed report saved to: ${reportPath}`);
  
  // Exit with appropriate code
  process.exit(summary.failedTests > 0 ? 1 : 0);
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// Help message
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Dashboard Test Suite Runner

Usage: node ${__filename} [options]

Options:
  --headless      Run tests in headless mode (default: true)
  --headed        Run tests with browser UI
  --browser       Browser to use (chrome, firefox, edge)
  --parallel      Run tests in parallel
  --env           Environment (local, staging, production)
  --record        Record tests to Cypress Dashboard
  --spec          Run specific test file or pattern
  --tags          Run tests with specific tags
  --help, -h      Show this help message

Test Suites:
  dashboard-core    Basic loading and date filtering
  dashboard-table   Table operations and pagination
  dashboard-export  Export functionality (PDF, XLSX, CSV)
  dashboard-charts  Chart integration and data visualization

Examples:
  node ${__filename}
  node ${__filename} --headed --browser firefox
  node ${__filename} --spec "01-dashboard-load"
  node ${__filename} --env staging --record
  `);
  process.exit(0);
}

// Run the test suite
runTestSuite().catch(error => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
}); 