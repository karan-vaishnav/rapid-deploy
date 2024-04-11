import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadAzureFolder } from "./azure";
import { buildProject } from "./utils";

const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
    while (true) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        );
        const id = res?.element;
        
        if (id) {
            await downloadAzureFolder(`${id}`);
            await buildProject(id);
            copyFinalDist(id);
            publisher.hSet("status", id, "deployed")

        } else {
            console.log('No job found in the build queue.');
        }
    }
}

main().catch(error => {
    console.error('An error occurred:', error);
});