import Center from "@/components/center";
import { SignIn } from "@clerk/nextjs";
import Waves from "./waves.svg";

export default function Page() {
    console.log(Waves);
    return (
        <Center>
            <Waves className="col-span-full row-span-full" />
            <Center className="col-span-full row-span-full">
                <SignIn />
            </Center>
        </Center>
    );
}
