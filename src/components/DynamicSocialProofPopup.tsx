"use client";

import dynamic from "next/dynamic";

const SocialProofPopup = dynamic(() => import("./SocialProofPopup").then(mod => mod.SocialProofPopup), {
    ssr: false,
});

export function DynamicSocialProofPopup() {
    return <SocialProofPopup />;
}
