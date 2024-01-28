"use client";
import axios from "axios";
import React from "react";

const MyComponent: React.FC = () => {
    const textDecoder = new TextDecoder();
    const consoleLogStream = new WritableStream<Uint8Array>({
        write(chunk) {
            console.log(textDecoder.decode(chunk));
        },
        close() {
            console.log("done");
        },
        abort(err) {
            console.log("err", err);
        },
    });

    const handleClick = async () => {
        try {
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
            void body.pipeTo(consoleLogStream);

            // console.log((await fetch("/api/test")).body as ReadableStream);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const handleClick2 = async () => {
        try {
            const textDecoder = new TextDecoder();

            const response = await fetch("/api/test", { method: "GET", headers: { "Content-Type": "text/event-stream" } });

            const writableStream = new WritableStream<string>({
                write(chunk) {
                    console.log("chunk", chunk);
                },
                close() {
                    console.log("done");
                },
                abort(err) {
                    console.log("err", err);
                },
                start(controller) {
                    console.log("start");
                },
            });

            console.log(" response body", response.body);
            const reader = response.body!.pipeThrough(new TextDecoderStream()).pipeTo(writableStream);
            // while (true) {
            //     const { value, done } = await reader.read();
            //     if (done) break;
            //     console.log("Received :", value);
            // }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const handleClick3 = async () => {
        try {
            fetch("/api/test3", {
                method: "GET",
                // headers: {
                //     "Content-Type": "text/event-stream",
                // },
            })
                .then((res) => {
                    void res.body?.pipeTo(consoleLogStream);
                })
                .catch((err) => {
                    if (axios.isAxiosError(err)) {
                        console.log("axios err", err);
                    } else {
                        console.log("err", err);
                        // handleUnexpectedError(error);
                    }
                });
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const handleClick4 = async () => {
        try {
            axios
                .get("/api/test3", {
                    responseType: "stream",
                    onDownloadProgress: (progressEvent) => {
                        console.log("progressEvent", progressEvent);
                    },
                })
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    if (axios.isAxiosError(err)) {
                        console.log("axios err", err);
                    } else {
                        console.log("err", err);
                        // handleUnexpectedError(error);
                    }
                });
            // void axios({
            //     method: "get",
            //     url: "https://bit.ly/2mTM3nY",
            //     responseType: "stream",
            // }).then(function (response) {
            //     console.log("response", response.data);
            //     // response.data.pipe(consoleLogStream);
            // });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <button onClick={handleClick}>Click Me</button>
            <button onClick={handleClick2}>Click Me</button>
            <button onClick={handleClick3}>test3 fetch</button>
            <button onClick={handleClick4}>test3 axios</button>
        </>
    );
};

export default MyComponent;
