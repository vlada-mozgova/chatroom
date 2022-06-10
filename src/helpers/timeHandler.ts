export const timeHandler = (time: string) => time.split(" ")[4].slice(0, 5);

export const dateHandler = (time: string) => time.slice(4, 10);
