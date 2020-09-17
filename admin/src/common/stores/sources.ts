import JSONAPISource from '@orbit/jsonapi'
import MemorySource from '@orbit/memory';
import IndexedDBSource from '@orbit/indexeddb';
import Coordinator, { RequestStrategy, SyncStrategy } from '@orbit/coordinator';

import { ModelRegistry } from '../models/index'
import { LogLevel } from '@orbit/coordinator';



const schema = ModelRegistry.orbitSchema()
export const store = new MemorySource({ schema });

const remote = new JSONAPISource({
  schema,
  name: "remote",
  host: "http://localhost:3000/api/v1"
})

const backup = new IndexedDBSource({
  schema,
  name: 'backup',
  namespace: 'greenlight',
});


const coordinator = new Coordinator({
  sources: [store, remote, backup],
});


;(window as any).GL = {
  store, remote, backup
}

// Query the remote server whenever the store is queried
// coordinator.addStrategy(new RequestStrategy({
//   source: 'memory',
//   on: 'beforeQuery',
//   target: 'remote',
//   action: 'pull',
//   blocking: true
// }));

// // Update the remote server whenever the store is updated
// coordinator.addStrategy(new RequestStrategy({
//   source: 'memory',
//   on: 'beforeUpdate',
//   target: 'remote',
//   action: 'push',
//   blocking: true
// }));
// // Sync all changes received from the remote server to the store
// coordinator.addStrategy(new SyncStrategy({
//   source: 'remote',
//   target: 'memory',
//   blocking: false,
// }));
// // Back up data to IndexedDB
// coordinator.addStrategy(new SyncStrategy({
//   source: 'memory',
//   target: 'backup',
//   blocking: false,
// }));

// Restore data from IndexedDB upon launch
const restore = backup.pull((q) => q.findRecords())
  .then((transform) => store.sync(transform))
  .then(() => coordinator.activate());

  export const restoreBackup = () => restore;


coordinator.activate({ logLevel: LogLevel.Info })
