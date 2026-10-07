import cronJob from "node-cron";

// Define types for the task functions to ensure proper error handling and typing
const everySecondTask = async (): Promise<void> => {
  try {
    console.log("Task running every second...");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const everySecond = (): void => {
  cronJob.schedule("* * * * * *", everySecondTask); // Runs every second
};

const day2Task = async (): Promise<void> => {
  try {
    // Your task logic for day 2 here
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const day1Task = async (): Promise<void> => {
  try {
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const day10Task = async (): Promise<void> => {
  try {
    // Your task logic for day 10 here
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const day10 = (): void => {
  cronJob.schedule("0 0 */10 * *", day10Task); // Runs every 10 days
};

const day2 = (): void => {
  cronJob.schedule("0 0 */2 * *", day2Task); // Runs every 2 days
};

const day1 = (): void => {
  cronJob.schedule("0 0 */1 * *", day1Task); // Runs every 1 day
};

day2();
day1();
day10();
everySecond();

export { day1, day2, everySecond };
