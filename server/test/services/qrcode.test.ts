import assert from 'assert';
import app from '../../src/app';

describe('\'qrcode\' service', () => {
  it('registered the service', () => {
    const service = app.service('qrcode');

    assert.ok(service, 'Registered the service');
  });
});
