import Center from "@/components/center";
import { SignUp } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function Page() {
    return (
        <Center className={styles.wave}>
            <SignUp />
        </Center>
    );
}
