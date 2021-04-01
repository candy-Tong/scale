import { Base } from '../../../src/scales/base';
import { BaseOptions, Domain, Range } from '../../../src/types';
import { ticks } from '../../../src/tick-method/basic';

class Scale extends Base<BaseOptions> {
  // eslint-disable-next-line class-methods-use-this
  public map(x: Domain<BaseOptions>) {
    return x;
  }

  // eslint-disable-next-line class-methods-use-this
  public invert(x: Range<BaseOptions>) {
    return x;
  }

  public clone() {
    return new Scale(this.options);
  }
}

describe('Scale', () => {
  test('Scale() has expected defaults', () => {
    const s = new Scale();
    // @ts-ignore
    const { formatter, tickMethod, ...restOptions } = s.options;

    expect(restOptions).toEqual({
      domain: [0, 1],
      range: [0, 1],
      tickCount: 5,
      tickInterval: 10,
    });
    expect(formatter(1)).toBe('1');
    // @ts-ignore
    expect(tickMethod(s.options)).toEqual([]);
    expect(tickMethod).toEqual(ticks);
  });

  test('Scale(options) override defaults', () => {
    const s = new Scale({
      tickCount: 20,
      domain: [0, 10],
    });

    // @ts-ignore
    expect(s.options.tickCount).toBe(20);
    // @ts-ignore
    expect(s.options.domain).toEqual([0, 10]);
  });

  test('Scale({}, defaults) set defaults', () => {
    const s = new Scale({}, { domain: [0, 20] });

    // @ts-ignore
    expect(s.options.domain).toEqual([0, 20]);
  });

  test('getOptions() return current Options', () => {
    const s = new Scale();
    // @ts-ignore
    expect(s.options).toEqual(s.getOptions());
  });

  test('update(options) update options', () => {
    const s = new Scale();

    s.update({
      tickCount: 10,
      domain: [0, 10],
    });

    const options = s.getOptions();

    expect(options.tickCount).toBe(10);
    expect(options.domain).toEqual([0, 10]);
  });

  test('getTicks() call options.tickMethod and return its return value', () => {
    const s = new Scale();
    const mockFn = jest.fn();
    s.update({
      tickMethod: () => {
        mockFn();
        return [1, 2, 3, 4, 5];
      },
    });

    expect(s.getTicks()).toEqual([1, 2, 3, 4, 5]);
    expect(mockFn).toBeCalled();
  });

  test('clone() return a scale belong to same class', () => {
    const s = new Scale();
    const s1 = s.clone();
    expect(s1).toBeInstanceOf(Scale);
  });

  test('clone() return a scale with the same options as the original one', () => {
    const s = new Scale();
    const s1 = s.clone();
    expect(s.getOptions()).toEqual(s1.getOptions());
  });

  test('clone() return a scale isolating change with the original one', () => {
    const s = new Scale();
    const s1 = s.clone();

    s.update({
      tickCount: 20,
    });
    expect(s1.getOptions().tickCount).toBe(5);

    s1.update({
      tickCount: 30,
    });
    expect(s.getOptions().tickCount).toBe(20);
  });
});