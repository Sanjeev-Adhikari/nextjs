import { InboxData } from "@/interfaces/inbox";
import { useEffect, useState } from "react";

export const useFetchAllInbox = () => {
    const [inbox, setInbox] = useState<InboxData[] | null>(null);

    useEffect(() => {
        fetch("/api/contact", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched data:", data);
                if (data.success) {
                    setInbox(data.data);
                } else {
                    console.error("Data fetch failed:", data.message);
                }
            })
            .catch((error) => { console.error("Error fetching data:", error); });
    }, []);

    return inbox;
};