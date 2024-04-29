import React from "react";
import { Home } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HowItWorksProps {}

const HowItWorks: React.FC<HowItWorksProps> = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-4 left-4 z-10">
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4 mr-2" /> Home
          </Button>
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="max-w-6xl mx-auto p-6">
          <h3 className="text-2xl  tracking-tight bg-background fg-foreground mb-4">
            How It Works
          </h3>
          <ol className="space-y-4 fg-muted">
            <li className="flex flex-col md:flex-row">
              <span className="flex-none font-mono fg-subtle mb-2 md:mb-0">
                01
              </span>
              <div className="md:ml-4">
                <span className="">Upload or Connect</span>
                <p className="mt-1 text-sm">
                  Start by uploading your files or connecting to the services
                  you use. Currently Endlessa supports your own file types,
                  google drive, and text message. We are adding more
                  integrations every week.
                </p>
              </div>
            </li>
            <li className="flex flex-col md:flex-row">
              <span className="flex-none font-mono fg-subtle mb-2 md:mb-0">
                02
              </span>
              <div className="md:ml-4">
                <span className="">Create Vector Embeddings</span>
                <p className="mt-1 text-sm">
                  Endlessa scans and analyzes all of your uploaded data and
                  creates vector embeddings, enabling efficient search and
                  retrieval of information across your entire knowledge base.
                </p>
              </div>
            </li>
            <li className="flex flex-col md:flex-row">
              <span className="flex-none font-mono fg-subtle mb-2 md:mb-0">
                03
              </span>
              <div className="md:ml-4">
                <span className="">Interact with Your Data</span>
                <p className="mt-1 text-sm">
                  With your data indexed and vectorized, you can now interact
                  with it seamlessly. Use natural language queries to search,
                  retrieve, and analyze your information, all in one centralized
                  location.
                </p>
              </div>
            </li>
            <li className="flex flex-col md:flex-row">
              <span className="flex-none font-mono fg-subtle mb-2 md:mb-0">
                04
              </span>
              <div className="md:ml-4">
                <span className="">Resync and Stay Up-to-Date</span>
                <p className="mt-1 text-sm">
                  As your data changes, resync your sources with to keep your
                  knowledge base up-to-date.
                </p>
              </div>
            </li>
          </ol>

          <div className="my-8 border-t border-border"></div>

          <div>
            <h3 className="text-2xl  bg-background fg-foreground mb-4">FAQs</h3>
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="item-1">
                <AccordionTrigger className="fg-foreground">
                  What data sources can I connect to Endlessa?
                </AccordionTrigger>
                <AccordionContent className="text-sm fg-muted">
                  Currently Endlessa supports your own file types, google drive,
                  and text message. We are adding more integrations every week.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="fg-foreground">
                  How does Endlessa handle data privacy and security?
                </AccordionTrigger>
                <AccordionContent className="text-sm fg-muted">
                  Endlessa is an open-source platform, which means you can
                  inspect and verify how your data is being stored and
                  processed. We don&apos;t share or sell your data to third
                  parties, and you have full control over what data is included
                  in your knowledge base.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="fg-foreground">
                  Do I need to pay for AI features in Endlessa?
                </AccordionTrigger>
                <AccordionContent className="text-sm fg-muted">
                  No, Endlessa is &quot;bring your own API key.&quot; We
                  don&apos;t upcharge any AI features. You&apos;ll need to
                  provide your own API keys for the AI services you want to use,
                  but Endlessa doesn&apos;t add any additional fees on top of
                  that.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
