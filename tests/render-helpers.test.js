// tests/render-helpers.test.js — Test shared HTML builder functions
import { describe, it, expect } from 'vitest';

describe('buildHeroSection', () => {
  it('renders label and value', () => {
    const html = buildHeroSection({ label: 'Total', value: '$100,000' });
    expect(html).toContain('tab-hero');
    expect(html).toContain('tab-hero-label');
    expect(html).toContain('Total');
    expect(html).toContain('$100,000');
  });

  it('includes subtitle when provided', () => {
    const html = buildHeroSection({ label: 'X', value: 'Y', sub: '+$5,000', subClass: 'gain' });
    expect(html).toContain('tab-hero-sub');
    expect(html).toContain('+$5,000');
    expect(html).toContain('gain');
  });

  it('omits subtitle when not provided', () => {
    const html = buildHeroSection({ label: 'X', value: 'Y' });
    expect(html).not.toContain('tab-hero-sub');
  });

  it('applies valueStyle when provided', () => {
    const html = buildHeroSection({ label: 'X', value: 'Y', valueStyle: 'color:red' });
    expect(html).toContain('style="color:red"');
  });
});

describe('buildStatsRow', () => {
  it('renders multiple stat items', () => {
    const html = buildStatsRow([
      { label: 'Cost', value: '$50K' },
      { label: 'Count', value: '6' },
    ]);
    expect(html).toContain('tab-stats-row');
    expect(html).toContain('Cost');
    expect(html).toContain('$50K');
    expect(html).toContain('Count');
    expect(html).toContain('6');
  });

  it('applies flex and valueStyle', () => {
    const html = buildStatsRow([
      { label: 'Take-Home', value: '$10K', flex: '1', valueStyle: 'color:green' },
    ]);
    expect(html).toContain('flex:1');
    expect(html).toContain('color:green');
  });
});

describe('buildDetailGrid', () => {
  it('renders label/value pairs in a grid', () => {
    const html = buildDetailGrid([
      { label: 'Balance', value: '$100' },
      { label: 'Rate', value: '5.0%' },
    ]);
    expect(html).toContain('detail-grid');
    expect(html).toContain('detail-item');
    expect(html).toContain('Balance');
    expect(html).toContain('$100');
    expect(html).toContain('Rate');
    expect(html).toContain('5.0%');
  });

  it('applies valueStyle to individual items', () => {
    const html = buildDetailGrid([
      { label: 'X', value: 'Y', valueStyle: 'color:var(--color-loss)' },
    ]);
    expect(html).toContain('color:var(--color-loss)');
  });
});

describe('buildAccountSection', () => {
  it('renders a collapsible details/summary section', () => {
    const html = buildAccountSection({
      icon: '🏦',
      name: 'Test Account',
      meta: 'Institution · Type',
      body: '<p>Content</p>',
    });
    expect(html).toContain('<details class="account-section">');
    expect(html).toContain('account-header');
    expect(html).toContain('Test Account');
    expect(html).toContain('Institution · Type');
    expect(html).toContain('<p>Content</p>');
  });

  it('adds open attribute when open=true', () => {
    const html = buildAccountSection({
      icon: '🏦', name: 'X', meta: 'Y', body: 'Z', open: true,
    });
    expect(html).toContain('<details class="account-section" open>');
  });

  it('includes value and valueSub in header-right', () => {
    const html = buildAccountSection({
      icon: '🏦', name: 'X', meta: 'Y', body: 'Z',
      value: '$50,000', valueSub: '+$5K',
    });
    expect(html).toContain('account-header-right');
    expect(html).toContain('$50,000');
    expect(html).toContain('+$5K');
  });

  it('omits header-right when no value provided', () => {
    const html = buildAccountSection({
      icon: '🏦', name: 'X', meta: 'Y', body: 'Z',
    });
    expect(html).not.toContain('account-header-right');
  });
});

describe('buildTable', () => {
  it('renders a table with headers and rows', () => {
    const html = buildTable(
      [{ text: 'Ticker' }, { text: 'Value', style: 'text-align:right' }],
      [
        [{ text: 'VTI', className: 'ticker-cell' }, { text: '$10K', className: 'num-cell' }],
        [{ text: 'BND' }, { text: '$5K' }],
      ]
    );
    expect(html).toContain('holdings-table');
    expect(html).toContain('<th>Ticker</th>');
    expect(html).toContain('text-align:right');
    expect(html).toContain('class="ticker-cell"');
    expect(html).toContain('VTI');
    expect(html).toContain('BND');
    expect(html).toContain('$10K');
    expect(html).toContain('$5K');
  });

  it('renders correct number of rows', () => {
    const html = buildTable(
      [{ text: 'A' }],
      [
        [{ text: '1' }],
        [{ text: '2' }],
        [{ text: '3' }],
      ]
    );
    const matches = html.match(/<tr>/g);
    // 1 header row + 3 body rows = 4 total <tr>
    expect(matches).toHaveLength(4);
  });
});
