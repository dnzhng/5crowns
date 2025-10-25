import { getRoundCardValue } from '../cardValues';

describe('getRoundCardValue', () => {
  it('maps round 1 to card 3', () => {
    expect(getRoundCardValue(1)).toBe('3');
  });

  it('maps round 2 to card 4', () => {
    expect(getRoundCardValue(2)).toBe('4');
  });

  it('maps round 3 to card 5', () => {
    expect(getRoundCardValue(3)).toBe('5');
  });

  it('maps round 4 to card 6', () => {
    expect(getRoundCardValue(4)).toBe('6');
  });

  it('maps round 5 to card 7', () => {
    expect(getRoundCardValue(5)).toBe('7');
  });

  it('maps round 6 to card 8', () => {
    expect(getRoundCardValue(6)).toBe('8');
  });

  it('maps round 7 to card 9', () => {
    expect(getRoundCardValue(7)).toBe('9');
  });

  it('maps round 8 to card 10', () => {
    expect(getRoundCardValue(8)).toBe('10');
  });

  it('maps round 9 to card J (Jack)', () => {
    expect(getRoundCardValue(9)).toBe('J');
  });

  it('maps round 10 to card Q (Queen)', () => {
    expect(getRoundCardValue(10)).toBe('Q');
  });

  it('maps round 11 to card K (King)', () => {
    expect(getRoundCardValue(11)).toBe('K');
  });

  it('maps round 12 to card A (Ace)', () => {
    expect(getRoundCardValue(12)).toBe('A');
  });

  it('maps round 13 to card 2', () => {
    expect(getRoundCardValue(13)).toBe('2');
  });

  it('handles unmapped round numbers by returning string of number', () => {
    expect(getRoundCardValue(14)).toBe('14');
    expect(getRoundCardValue(0)).toBe('0');
    expect(getRoundCardValue(100)).toBe('100');
  });
});
