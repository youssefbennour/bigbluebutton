const { MultiUsers } = require('./multiusers');
const e = require('../core/elements');
const { timeInSeconds } = require('./util');
const { expect } = require('@playwright/test');
const { sleep } = require('../core/helpers');

class Timer extends MultiUsers {
  constructor(browser, context) {
    super(browser, context);
  }

  async timerTest() {
    await this.modPage.waitForSelector(e.whiteboard);
    await this.modPage.waitAndClick(e.actions);
    await this.modPage.waitAndClick(e.timerStopwatchFeature);
    await this.modPage.waitForSelector(e.timerCurrent);
    const timerCurrentLocator = await this.modPage.getLocator(e.timerCurrent);
    const timerIndicatorLocator = await this.modPage.getLocator(e.timerIndicator);

    const initialValueStopWatch = await timeInSeconds(timerCurrentLocator);
    const initialValueStopWatchIndicator = await timeInSeconds(timerIndicatorLocator);

    await this.modPage.hasText(e.timerCurrent, /00:00/, 'should the timer current contain the text "00:00"');
    await this.modPage.waitAndClick(e.startStopTimer);
    await sleep(2000);
    const currentValueStopwatch = await timeInSeconds(timerCurrentLocator);
    const currentValueStopwatchIndicator = await timeInSeconds(timerIndicatorLocator);
    await expect(currentValueStopwatch, 'should the current value of the stopwatch to be greater than the initial value').toBeGreaterThan(initialValueStopWatch);
    await expect(currentValueStopwatchIndicator, 'should the current value of the stopwatch indicator to be greater than the initial value on the stopwatch indicator').toBeGreaterThan(initialValueStopWatchIndicator);

    await this.modPage.waitAndClick(e.startStopTimer);
    await this.modPage.waitAndClick(e.resetTimerStopwatch);
    await this.modPage.hasText(e.timerCurrent, /00:00/, 'should reset the timer current');
    await this.modPage.hasText(e.timerIndicator, /00:00/, 'should reset the timer indicator');

    await this.modPage.waitAndClick(e.timerButton);
    await this.modPage.hasText(e.timerCurrent, /00:00/, 'should display the timer current to contain the value "00:00"');
    await this.modPage.hasValue(e.minutesInput, '5', 'should display the initial minutes input to contain the value "5"');
    await this.modPage.hasElement(e.timerContainer, 'should display the timer container');
    await this.modPage.getLocator(e.secondsInput).press('Backspace');
    await this.modPage.type(e.secondsInput, '4');
    await this.modPage.waitAndClick(e.startStopTimer);
    await expect(
      this.modPage.getLocator(e.startStopTimer),
      'should switch the button color after starting the timer'
    ).toHaveAttribute('color', 'danger')
    await this.modPage.hasText(e.timerCurrent, /05:00/, 'should the timer current to contain the value "05:00"');
    await this.modPage.hasText(e.timerIndicator, /04:59/, 'should the timer indicator to contain the value "04:59" (1 second delay)');

    await this.modPage.waitAndClick(e.startStopTimer);
    await expect(
      this.modPage.getLocator(e.startStopTimer),
      'should switch the button color after stopping the timer'
    ).toHaveAttribute('color', 'primary')
    await this.modPage.getLocator(e.secondsInput).press('Backspace');
    await this.modPage.type(e.secondsInput, '50');
    await this.modPage.waitAndClick(e.startStopTimer);
    await expect(
      this.modPage.getLocator(e.startStopTimer),
      'should switch the button color after starting the timer'
    ).toHaveAttribute('color', 'danger')
    await this.modPage.hasText(e.timerCurrent, /05:44/, 'should the timer current to contain the value "05:44"');
    await this.modPage.hasText(e.timerIndicator, /05:43/, 'should the timer indicator to contain the value "05:43" (1 second delay)');

    const timerInitialValue = await timeInSeconds(timerCurrentLocator);
    await this.modPage.waitAndClick(e.startStopTimer);
    await sleep(2000);
    const timerCurrentValue = await timeInSeconds(timerCurrentLocator);
    await expect(timerInitialValue, 'should the timer\'s initial value to be greater than the current value').toBeGreaterThan(timerCurrentValue);

    await this.modPage.waitAndClick(e.startStopTimer);
    await this.modPage.waitAndClick(e.resetTimerStopwatch);

    await this.modPage.hasText(e.timerCurrent, /05:50/, 'should display the same timer current value as the last time it was started');
    await this.modPage.hasText(e.timerIndicator, /05:50/, 'should display the same timer indicator value as the last time it was started');

    //Testing Timer Indicator
    const initialValueIndicator = await timeInSeconds(timerIndicatorLocator);
    await this.modPage.waitAndClick(e.timerIndicator);
    await sleep(2000);

    const currentValueIndicator = await timeInSeconds(timerIndicatorLocator);
    await expect(initialValueIndicator, 'should the timer indicator initial value to be greater than the timer indicator current value').toBeGreaterThan(currentValueIndicator);
  }
}

exports.Timer = Timer;
