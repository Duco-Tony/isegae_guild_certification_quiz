// Test Scenarios for Microsoft Certification Quiz Redesign
// Run: node test-scenarios.js

const {
  computeTrackScores,
  getTopTrack,
  getMainFundamentalsCert,
  getSubFundamentals,
  getSituationType,
  getCodingLevel,
  getTimeCommitment,
  getNextStepRecommendation,
  getContentHooks,
  canRecommendExpert
} = require('./lib/scoring');

const { getPersona } = require('./lib/personas');
const { encodeAnswers, decodeAnswers } = require('./lib/shareUtils');

console.log('🧪 Testing Microsoft Certification Quiz Redesign\n');

// Test 1: Scoring only Q2-Q5 (Q1, Q6, Q7 should not contribute)
console.log('📊 Test 1: Scoring System');
const testAnswers1 = ['q1_a', 'q2_d', 'q3_b', 'q4_c', 'q5_a', 'q6_a', 'q7_a'];
const scores1 = computeTrackScores(testAnswers1);
console.log('Test answers:', testAnswers1);
console.log('Track scores (only Q2-Q5 contribute):');
console.log(scores1);
console.log('Highest scoring track:', getTopTrack(scores1, testAnswers1[2]));
console.log();

// Test 2: Tiebreaker with Q3
console.log('🔀 Test 2: Tiebreaker Logic');
const equalScores = {
  AI: 10,
  Cloud: 10,
  Data: 5,
  Security: 5,
  M365: 3,
  PowerPlatform: 3,
  Copilot: 3
};
console.log('Tied scores (AI and Cloud both 10):', equalScores);
console.log('Q3 = q3_b (AI favor):', getTopTrack(equalScores, 'q3_b'));
console.log('Q3 = q3_f (mixed AI/Cloud):', getTopTrack(equalScores, 'q3_f'));
console.log();

// Test 3: 42 Personas
console.log('👤 Test 3: 42 Personas (6 situations × 7 tracks)');
const situations = ['q1_a', 'q1_b', 'q1_c', 'q1_d', 'q1_e', 'q1_f'];
const tracks = ['AI', 'Cloud', 'Data', 'Security', 'M365', 'PowerPlatform', 'Copilot'];
console.log('Sample personas:');
situations.slice(0, 3).forEach(q1 => {
  tracks.slice(0, 3).forEach(track => {
    const persona = getPersona(q1, track);
    console.log(`  ${q1} + ${track}: ${persona}`);
  });
});
console.log();

// Test 4: AI-900 → AI-901 Date-based switching
console.log('📅 Test 4: AI-900 → AI-901 Date-based Switching');
const beforeSwitch = new Date('2026-06-15');
const afterSwitch = new Date('2026-07-15');
console.log('Before 2026-06-30:', getMainFundamentalsCert('AI', beforeSwitch));
console.log('After 2026-06-30:', getMainFundamentalsCert('AI', afterSwitch));
console.log();

// Test 5: Sub Fundamentals with 70% threshold
console.log('📈 Test 5: Sub Fundamentals (70% threshold)');
const testScores = {
  AI: 15,      // Main
  Cloud: 12,   // 80% - should show
  Data: 10,    // 67% - should NOT show
  Security: 5,
  M365: 3,
  PowerPlatform: 2,
  Copilot: 11  // 73% - should show
};
const subs = getSubFundamentals('AI', testScores);
console.log('Main track: AI (score 15)');
console.log('Sub recommendations (70%+ only):', subs);
console.log();

// Test 6: Associate/Expert Recommendations
console.log('🎓 Test 6: Associate/Expert Recommendations');
const testCases = [
  { track: 'Cloud', coding: 'none', situation: 'jobseeker', time: 'fast' },
  { track: 'Cloud', coding: 'advanced', situation: 'itWorker', time: 'deep' },
  { track: 'Data', coding: 'none', situation: 'nonIT', time: 'moderate' },
  { track: 'PowerPlatform', coding: 'advanced', situation: 'itWorker', time: 'deep' }
];

testCases.forEach(tc => {
  const canExpert = canRecommendExpert(tc.situation, tc.time);
  const nextStep = getNextStepRecommendation(tc.track, tc.coding, tc.situation, tc.time);
  console.log(`${tc.track} + ${tc.coding} + ${tc.situation}:`);
  console.log(`  Can recommend Expert: ${canExpert}`);
  console.log(`  Associate: ${nextStep.associate || 'None'}`);
  console.log(`  Expert: ${nextStep.expert || 'None'}`);
});
console.log();

// Test 7: URL Encoding (Number-based)
console.log('🔗 Test 7: URL Encoding (Number-based)');
const originalAnswers = ['q1_a', 'q2_b', 'q3_c', 'q4_d', 'q5_e', 'q6_f', 'q7_g'];
const encoded = encodeAnswers(originalAnswers);
console.log('Original:', originalAnswers);
console.log('Encoded:', encoded, '(should be "1234567")');
const decoded = decodeAnswers(encoded);
console.log('Decoded:', decoded);
console.log('Match:', JSON.stringify(originalAnswers) === JSON.stringify(decoded));
console.log();

// Test 8: Backward Compatibility (Letter-based decoding)
console.log('🔄 Test 8: Backward Compatibility');
const oldFormat = 'abcdefg';
const decodedOld = decodeAnswers(oldFormat);
console.log('Old format:', oldFormat);
console.log('Decoded:', decodedOld);
console.log();

// Test 9: Content Hooks based on Q7
console.log('💡 Test 9: Content Hooks (Q7 barriers)');
const barriers = ['q7_a', 'q7_b', 'q7_c', 'q7_d', 'q7_e', 'q7_f', 'q7_g'];
barriers.forEach(q7 => {
  const hooks = getContentHooks(q7);
  console.log(`${q7}: ${hooks[0]}`);
});
console.log();

// Test 10: Negative Weights in Q4
console.log('➖ Test 10: Negative Weights (Q4 coding)');
const testWithNegative1 = ['q1_a', 'q2_a', 'q3_a', 'q4_a', 'q5_g', 'q6_a', 'q7_a'];
const scoresNeg1 = computeTrackScores(testWithNegative1);
console.log('Q4_a (최대한 피하고 싶어요) scores:');
console.log('  Cloud:', scoresNeg1.Cloud, '(should be reduced by -2)');
console.log('  Security:', scoresNeg1.Security, '(should be reduced by -1)');
console.log('  PowerPlatform:', scoresNeg1.PowerPlatform, '(should be increased)');
console.log();

console.log('✅ All tests completed!');
console.log('\n📌 Summary:');
console.log('- 7 questions with new structure');
console.log('- 42 personas (6 situations × 7 tracks)');
console.log('- 21 certifications (8 Fundamentals + 13 Associate/Expert)');
console.log('- Q2-Q5 scoring only (Q1, Q6, Q7 are metadata)');
console.log('- Q3 tiebreaker logic');
console.log('- 70% threshold for sub recommendations');
console.log('- Conditional Associate/Expert recommendations');
console.log('- Number-based URL encoding with backward compatibility');
console.log('- AI-900 → AI-901 date-based switching');