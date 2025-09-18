import { Tree, names } from '@nx/devkit';

jest.setTimeout(30000);
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { eventBusGenerator } from '../../../../libs/ddd/src/generators/event-bus/generator';
import { hexDomainGenerator } from '../../../../libs/ddd/src/generators/hex-domain/generator';
import { portGenerator } from '../../../../libs/ddd/src/generators/port/generator';
import { uowGenerator } from '../../../../libs/ddd/src/generators/uow/generator';
import webAppGenerator from '../../../../libs/ddd/src/generators/web-app/generator';

describe('Generators idempotency', () => {
    let tree: Tree;
    const domainName = 'idempotency-domain';

    beforeEach(async () => {
        tree = createTreeWithEmptyWorkspace();
        await hexDomainGenerator(tree, { name: domainName });
    });

    it('hex-domain: second run produces no changes', async () => {
        const first = tree.listChanges();
        await hexDomainGenerator(tree, { name: domainName });
        const second = tree.listChanges();
        expect(second).toEqual(first);
    });

    it('port (ts): second run yields identical files', async () => {
        await portGenerator(tree, { name: 'sample-port', domain: domainName, language: 'ts' });
            const prop = names('sample-port').propertyName;
            const before = tree.read(`libs/${domainName}/domain/src/lib/ports/${prop}.port.ts`)!.toString();
        await portGenerator(tree, { name: 'sample-port', domain: domainName, language: 'ts' });
            const after = tree.read(`libs/${domainName}/domain/src/lib/ports/${prop}.port.ts`)!.toString();
        expect(after).toEqual(before);
    });

    it('port (py): second run yields identical files', async () => {
        await portGenerator(tree, { name: 'sample_port', domain: domainName, language: 'py' });
        const before = tree.read(`libs/${domainName}/domain/src/lib/ports/sample_port_port.py`)!.toString();
        await portGenerator(tree, { name: 'sample_port', domain: domainName, language: 'py' });
        const after = tree.read(`libs/${domainName}/domain/src/lib/ports/sample_port_port.py`)!.toString();
        expect(after).toEqual(before);
    });

    it('uow (ts): second run yields identical files', async () => {
        await uowGenerator(tree, { domain: domainName, language: 'ts' });
        const before = tree.read(`libs/${domainName}/domain/src/lib/ports/unit-of-work.port.ts`)!.toString();
        await uowGenerator(tree, { domain: domainName, language: 'ts' });
        const after = tree.read(`libs/${domainName}/domain/src/lib/ports/unit-of-work.port.ts`)!.toString();
        expect(after).toEqual(before);
    });

    it('uow (py): second run yields identical files', async () => {
        await uowGenerator(tree, { domain: domainName, language: 'py' });
        const before = tree.read(`libs/${domainName}/domain/src/lib/ports/unit_of_work_port.py`)!.toString();
        await uowGenerator(tree, { domain: domainName, language: 'py' });
        const after = tree.read(`libs/${domainName}/domain/src/lib/ports/unit_of_work_port.py`)!.toString();
        expect(after).toEqual(before);
    });

    it('event-bus (ts): second run yields identical files', async () => {
        await eventBusGenerator(tree, { domain: domainName, language: 'ts' });
        const before = tree.read(`libs/${domainName}/domain/src/lib/ports/event-bus.port.ts`)!.toString();
        await eventBusGenerator(tree, { domain: domainName, language: 'ts' });
        const after = tree.read(`libs/${domainName}/domain/src/lib/ports/event-bus.port.ts`)!.toString();
        expect(after).toEqual(before);
    });

    it('event-bus (py): second run yields identical files', async () => {
        await eventBusGenerator(tree, { domain: domainName, language: 'py' });
        const before = tree.read(`libs/${domainName}/domain/src/lib/ports/event_bus_port.py`)!.toString();
        await eventBusGenerator(tree, { domain: domainName, language: 'py' });
        const after = tree.read(`libs/${domainName}/domain/src/lib/ports/event_bus_port.py`)!.toString();
        expect(after).toEqual(before);
    });

    it('web-app: re-run creates no diffs in shared lib', async () => {
        await webAppGenerator(tree, { name: 'web-next', framework: 'next', apiClient: true, routerStyle: 'app' });
        const before = tree.read('libs/shared/web/src/lib/client.ts')!.toString();
        await webAppGenerator(tree, { name: 'web-next', framework: 'next', apiClient: true, routerStyle: 'app' });
        const after = tree.read('libs/shared/web/src/lib/client.ts')!.toString();
        expect(after).toEqual(before);
    });
});
