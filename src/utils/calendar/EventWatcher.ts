import { Category } from './Category'

export class EventWatcher {
  // TODO this is mock
  public static readonly events: Category[] = [
    {
      categoryId: 'test',
      categoryName: 'test',
      color: 'F04DEA',
      timeObjects: ['pretend theres stuff here', 'more stuff']
    },
    {
      categoryId: '319 Course',
      categoryName: '319 Course',
      color: '4DF07B',
      timeObjects: ['pretend theres stuff here', 'more stuff']
    }
  ]
  private watchers: (() => void)[] = []

  // TODO this is a mock function

  // do we even need this
  public subscribeToEventChanges(newWatcher: () => void) {
    this.watchers.push(newWatcher)
  }
}
