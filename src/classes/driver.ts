import { EntryData, EntryInfo } from 'types';

export default abstract class Driver {
  public abstract add_entry(entry_info: EntryInfo): Promise<boolean> | boolean;

  public abstract get_entry(entry_info: EntryInfo): Promise<EntryData | undefined> | (EntryData | undefined);

  public abstract remove_entry(entry_info: EntryInfo): Promise<boolean> | boolean;

  public abstract update_entry(entry_info: EntryInfo): Promise<boolean> | boolean;
}
