import Center from "@/components/center";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <Center>
            <Image src="/logo.svg" alt="Logo" width={200} height={200} />
            <SignIn />
        </Center>
    );
}
