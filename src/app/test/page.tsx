"use client";
import axios from "axios";
import React from "react";

const MyComponent: React.FC = () => {
    const handleClick = async () => {
        try {
            const textDecoder = new TextDecoder();

            // axios
            //     .get("/api/test", {
            //         responseType: "stream",
            //     })
            //     .then((res) => {
            //         console.log(res.data);
            //     })
            //     .catch((err) => {
            //         if (axios.isAxiosError(err)) {
            //             console.log("axios err", err);
            //         } else {
            //             console.log("err", err);
            //             // handleUnexpectedError(error);
            //         }
            //     });
            const fetchData = await fetch("/api/test");
            const body = fetchData.body as ReadableStream;
            // pipe the result stream into a console log
            void body.pipeTo(
                new WritableStream<Uint8Array>({
                    write(chunk) {
                        console.log(textDecoder.decode(chunk));
                    },
                    close() {
                        console.log("done");
                    },
                    abort(err) {
                        console.log("err", err);
                    },
                }),
            );

            // console.log((await fetch("/api/test")).body as ReadableStream);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const handleClick2 = async () => {
        try {
            const textDecoder = new TextDecoder();

            const DUMMY_URL = "/api/test2";
            // use axios to get a Readable stream response
            const vv = await axios.get(DUMMY_URL, {
                responseType: "stream",
            });
            console.log("🚀 ~ file: page.tsx:56 ~ handleClick2 ~ vv:", vv);
            // console.log("🚀 ~ file: page.tsx:56 ~ handleClick2 ~ data:", data);

            // now, you can process or transform the data as a Readable type.
            // void data.pipe(
            //     new WritableStream<Uint8Array>({
            //         write(chunk) {
            //             console.log(textDecoder.decode(chunk));
            //         },
            //         close() {
            //             console.log("done");
            //         },
            //         abort(err) {
            //             console.log("err", err);
            //         },
            //     }),
            // );

            // console.log((await fetch("/api/test")).body as ReadableStream);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <button onClick={handleClick}>Click Me</button>
            <button onClick={handleClick2}>Click Me</button>
        </>
    );
};

export default MyComponent;
