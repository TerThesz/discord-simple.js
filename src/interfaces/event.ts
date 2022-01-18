export default interface Event {
  name: string;
  once?: boolean;

  execute(...args: any[]): void;
}
