import "reflect-metadata";
import { Configuration } from '../src/Configuration';

describe('Configuration', function () {

  it('Getters', async function () {
    // A
    // A
    const configuration = new Configuration();

    // A
    expect(configuration.Name).toBe('mExport');
    expect(configuration.Version).toBe('SANDBOX');
    expect(configuration.Debug).toBe(false);
    expect(configuration.DatabasePath).not.toBeUndefined();
  });
});
