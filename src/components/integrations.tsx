"use client"
import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FcCalendar } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
import { MdOutlineFolder } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { BsArrowRepeat } from "react-icons/bs";
import { BsTrello, BsDropbox } from "react-icons/bs";
import { FaGoogleDrive, FaRegCommentDots, FaRegComments } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
interface Integration {
id: number;
name: string;
icon: React.FC<React.SVGProps<SVGSVGElement>>;
active: boolean;
comingSoon: boolean;
}
const Integrations: React.FC = () => {
const [integrations, setIntegrations] = React.useState<Integration[]>([
{
id: 5,
name: "Your Files",
icon: MdOutlineFolder,
active: true,
comingSoon: false,
},
{
id: 11,
name: "Text Message",
icon: FaRegComments,
active: false,
comingSoon: true,
},
{
id: 9,
name: "Outlook",
icon: HiOutlineMail,
active: false,
comingSoon: true,
},
{
id: 1,
name: "Google Calendar",
icon: FcCalendar,
active: false,
comingSoon: true,
},
{
id: 6,
name: "Google Drive",
icon: FaGoogleDrive,
active: false,
comingSoon: true,
},
{
id: 8,
name: "Gmail",
icon: HiOutlineMail,
active: false,
comingSoon: true,
},
{ id: 2, name: "Trello", icon: BsTrello, active: false, comingSoon: true },
{
id: 3,
name: "GitHub",
icon: IoLogoGithub,
active: false,
comingSoon: true,
},
{ id: 4, name: "Notion", icon: BsDropbox, active: false, comingSoon: true },
{
id: 7,
name: "Dropbox",
icon: BsDropbox,
active: false,
comingSoon: true,
},
{
id: 10,
name: "iMessage",
icon: FaRegCommentDots,
active: false,
comingSoon: true,
},
]);
const toggleIntegration = (id: number) => {
setIntegrations((prevIntegrations) =>
prevIntegrations.map((integration) =>
integration.id === id
? { ...integration, active: !integration.active }
: integration
)
);
};

return (
<Sheet>
<SheetTrigger asChild>
<Button variant="outline">
<FiGrid className="h-4 w-4" />
</Button>
</SheetTrigger>
<SheetContent side="right" className="p-4">
<div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
<h2 className="text-lg  text-foreground">
Integrations
</h2>
{integrations.map((integration) => (
<div
           key={integration.id}
           className="flex justify-between items-center p-4 rounded-md bg-card"
         >
<div className="flex items-center space-x-4">
<div className="w-5 h-5">
<integration.icon className="text-foreground" />
</div>
<span className="text-foreground">
{integration.name}
{integration.comingSoon && (
<span className="">
*
</span>
)}
</span>
</div>
<div className="flex items-center space-x-2">
<Switch
checked={integration.active}
onCheckedChange={() => toggleIntegration(integration.id)}
className="{data-[state=checked]:bg-foreground data-[state=unchecked]:bg-slate-500 bg-border}"
disabled={integration.comingSoon}
/>
<Button
variant="ghost"
size="sm"

>
<BsArrowRepeat size={20} className="text-foreground" />
</Button>
</div>
</div>
))}
</div>
<div className="pb-4 pt-4">
<Button variant="default">
Manage Integrations
</Button>
<p className="p-2 text-xs">* = Coming Soon</p>
</div>
</SheetContent>
</Sheet>
);
};
export default Integrations;