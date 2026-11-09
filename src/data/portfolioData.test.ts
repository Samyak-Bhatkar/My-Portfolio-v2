import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROJECTS,
  EXPERIMENTS,
  TECH_STACK,
  HACKATHON_STEPS,
  CURRICULUM_STAGES,
  SCROLL_ANIM_OPTIONS,
  getFlattenedSkills,
  formatRecoveredProgress,
  parseEmphasizedWords,
} from './portfolioData.ts';

test('portfolio projects data integrity', () => {
  assert.equal(PROJECTS.length, 7);
  assert.equal(PROJECTS[0].t, 'Chitrapat');
  assert.equal(PROJECTS[1].t, 'ShilpSetu');
  assert.equal(PROJECTS[2].t, 'BoostNet');
  assert.equal(PROJECTS[3].t, 'Private PDF Tool');
  assert.equal(PROJECTS[4].t, 'ClassGPT');
  assert.equal(PROJECTS[5].t, 'TrackSure');
  assert.equal(PROJECTS[6].t, 'CityEye (NexWatch)');

  for (const project of PROJECTS) {
    assert.ok(project.n.length > 0);
    assert.ok(project.t.length > 0);
    assert.ok(project.accentColor.startsWith('#'));
    assert.ok(project.bgGradient.includes('linear-gradient'));
    assert.ok(project.f.length > 0);
    assert.ok(project.k.length > 0);
    assert.ok(project.image.startsWith('/projects/') || project.image.startsWith('/assets/'));
  }
});

test('experiments and tech stack integrity', () => {
  assert.equal(EXPERIMENTS.length, 8);
  assert.equal(EXPERIMENTS[0].n, '08');
  assert.equal(EXPERIMENTS[0].t, 'DSA Quest Tracker');
  assert.equal(EXPERIMENTS[1].n, '09');
  assert.equal(EXPERIMENTS[1].t, 'Visual Habit & Goal Tracker');
  assert.equal(EXPERIMENTS[2].n, '10');
  assert.equal(EXPERIMENTS[2].t, 'Medical Insurance Cost Predictor');
  assert.equal(EXPERIMENTS[7].n, '15');
  assert.equal(EXPERIMENTS[7].t, 'Customer Segmentation Clustering');

  for (const exp of EXPERIMENTS) {
    assert.ok(exp.n.length === 2);
    assert.ok(exp.t.length > 0);
    assert.ok(exp.tag.length > 0);
    assert.ok(exp.d.length > 0);
    assert.ok(exp.k.length > 0);
    assert.ok(exp.accentColor && exp.accentColor.startsWith('#'));
  }

  const categories = Object.keys(TECH_STACK);
  assert.ok(categories.includes('Programming'));
  assert.ok(categories.includes('AI / ML / GenAI'));
  assert.ok(categories.includes('Frontend'));
});

test('getFlattenedSkills filtering', () => {
  const allSkills = getFlattenedSkills('All');
  assert.ok(allSkills.length > 20);

  const frontendSkills = getFlattenedSkills('Frontend');
  assert.equal(frontendSkills.length, TECH_STACK['Frontend'].length);
  assert.ok(frontendSkills.every((s) => s.category === 'Frontend'));
});

test('formatRecoveredProgress formatting', () => {
  assert.equal(formatRecoveredProgress(0, 5), '0 / 5 recovered');
  assert.equal(formatRecoveredProgress(2, 5), '2 / 5 recovered');
  assert.equal(formatRecoveredProgress(5, 5), '5 / 5 recovered — all found!');
});

test('parseEmphasizedWords handles markdown stars', () => {
  const parsed = parseEmphasizedWords('Intelligence, shaped into *experiences.*');
  const accentWord = parsed.find((p) => p.isAccent);
  assert.ok(accentWord);
  assert.equal(accentWord?.word, 'experiences.');
});

test('hackathon steps has 5 sequential steps', () => {
  assert.equal(HACKATHON_STEPS.length, 5);
  assert.equal(HACKATHON_STEPS[0].title, 'Problem');
  assert.equal(HACKATHON_STEPS[4].title, 'Present');
});

test('curriculum stages matches user table specifications', () => {
  assert.equal(CURRICULUM_STAGES.length, 4);
  assert.equal(CURRICULUM_STAGES[0].stage, '01');
  assert.equal(CURRICULUM_STAGES[0].title, 'Foundations');
  assert.equal(CURRICULUM_STAGES[0].source, 'Code With Harry');

  assert.equal(CURRICULUM_STAGES[1].stage, '02');
  assert.equal(CURRICULUM_STAGES[1].title, 'Practical depth');
  assert.equal(CURRICULUM_STAGES[1].source, 'Jovian');

  assert.equal(CURRICULUM_STAGES[2].stage, '03');
  assert.equal(CURRICULUM_STAGES[2].title, 'Concept depth');
  assert.equal(CURRICULUM_STAGES[2].source, 'StatQuest · Khan Academy');

  assert.equal(CURRICULUM_STAGES[3].stage, '04');
  assert.equal(CURRICULUM_STAGES[3].title, 'Built to ship');
  assert.ok(CURRICULUM_STAGES[3].source.includes('HTML'));
  assert.ok(CURRICULUM_STAGES[3].source.includes('React'));

  for (const item of CURRICULUM_STAGES) {
    assert.ok(item.copy.length > 10);
    assert.ok(item.proofBadge.length > 0);
    assert.ok(item.proofMetric.length > 0);
    assert.ok(item.stackTags.length > 0);
  }
});

test('scroll animation options integrity', () => {
  assert.equal(SCROLL_ANIM_OPTIONS.length, 7);
  const ids = SCROLL_ANIM_OPTIONS.map((o) => o.id);
  assert.ok(ids.includes('cascading'));
  assert.ok(ids.includes('parallax'));
  assert.ok(ids.includes('stack'));
  assert.ok(ids.includes('ambient'));
  assert.ok(ids.includes('skew'));
  assert.ok(ids.includes('laser'));
  assert.ok(ids.includes('default'));
});
