/**
 * questions.js
 * --------------------------------------------------------------
 * All quiz content lives here. Add, edit, or replace questions freely.
 *
 * Each question object has this shape:
 *   {
 *     topic:        string  -> one of the three topic keys (see TOPICS below)
 *     question:     string  -> the question text
 *     options:      string[4] -> exactly 4 answer choices
 *     correctIndex: number  -> index (0-3) of the correct option
 *     explanation:  string  -> why the right answer is right AND why the
 *                              wrong options are wrong (shown in feedback)
 *   }
 *
 * The three supported topics map to the AZ-900 skill areas:
 *   "cloud"        -> Cloud Concepts
 *   "architecture" -> Azure Architecture and Services
 *   "governance"   -> Azure Management and Governance
 * --------------------------------------------------------------
 */

/* Topic metadata used by the home screen and results screen. */
const TOPICS = [
  {
    key: "cloud",
    title: "Cloud Concepts",
    description: "Cloud models, shared responsibility, IaaS/PaaS/SaaS, pricing models, and the benefits of the cloud.",
    icon: "☁",
  },
  {
    key: "architecture",
    title: "Azure Architecture and Services",
    description: "Regions, resource hierarchy, compute, networking, storage, and identity and security.",
    icon: "◈",
  },
  {
    key: "governance",
    title: "Azure Management and Governance",
    description: "Cost management, governance and compliance, deployment and management tools, and monitoring.",
    icon: "⚖",
  },
];

/**
 * The question bank. 30 questions mapped to the public AZ-900 skills
 * outline (skills measured as of July 20, 2026). VERIFY every answer
 * against Microsoft Learn before use.
 *
 * Questions are kept in the same object shape as above. The `topic`
 * field uses the app's short topic keys so the quiz engine can group
 * them by topic.
 */
const QUESTIONS = [
  // ===================== Cloud Concepts (8) =====================
  // ---- Describe cloud computing ----
  {
    topic: "cloud",
    question: "Under the shared responsibility model, which responsibility stays with the customer whether they use IaaS, PaaS or SaaS?",
    options: [
      "Physical security of the datacenter",
      "Protecting their own data and user accounts",
      "Power and cooling for the servers",
      "Maintaining the physical network cables",
    ],
    correctIndex: 1,
    explanation:
      "The cloud provider always looks after the physical datacenter, including its security, power, cooling and cabling. The customer always stays responsible for its own data and for managing accounts and identities, whatever the service type. Responsibility for things like the operating system or the application shifts depending on whether you use IaaS, PaaS or SaaS.",
  },
  {
    topic: "cloud",
    question: "A retailer keeps its customer database in its own datacenter but runs its website on a cloud provider's shared infrastructure, and the two work together. Which cloud model is this?",
    options: [
      "Public cloud",
      "Private cloud",
      "Hybrid cloud",
      "Multi-cloud",
    ],
    correctIndex: 2,
    explanation:
      "A hybrid cloud combines a private environment, here the retailer's own datacenter, with a public cloud. Public cloud alone would mean everything runs on the provider's shared infrastructure. Private cloud alone would mean everything runs on infrastructure used by one organization. Multi-cloud means using more than one public cloud provider, which is not what the retailer is doing.",
  },
  {
    topic: "cloud",
    question: "A startup wants to avoid buying servers upfront and would rather pay each month for what it actually uses. Which type of spending does this describe?",
    options: [
      "Capital expenditure (CapEx)",
      "Operational expenditure (OpEx)",
      "A one-time licensing fee",
      "A fixed multi-year hardware lease",
    ],
    correctIndex: 1,
    explanation:
      "Operational expenditure is ongoing spending on services as you use them, which is how the cloud's consumption-based model works. Capital expenditure is a large upfront spend on physical assets such as servers. A one-time licensing fee and a fixed multi-year hardware lease are both fixed commitments, not pay-for-what-you-use.",
  },
  {
    topic: "cloud",
    question: "Which statement best describes serverless computing?",
    options: [
      "You rent a physical server that only you use",
      "You write code and the provider manages the servers and scaling behind the scenes",
      "You manage the operating system but not the hardware",
      "There are no servers involved at all",
    ],
    correctIndex: 1,
    explanation:
      "In serverless computing the provider handles the servers, the operating system and scaling, so you focus on your code, and you are usually billed for what actually runs. Servers still exist, you just do not manage them, which is why 'no servers at all' is wrong. Managing the operating system describes IaaS, and renting a dedicated physical server is not serverless.",
  },
  // ---- Describe the benefits of using cloud services ----
  {
    topic: "cloud",
    question: "An online shop expects a big rush during a sale and quiet afterwards, so it adds resources for the rush and removes them later. Which cloud benefit is this?",
    options: [
      "Scalability",
      "Predictability",
      "Governance",
      "Manageability",
    ],
    correctIndex: 0,
    explanation:
      "Scalability means you can increase or decrease resources to match demand. Predictability is about being able to forecast costs and performance. Governance is about rules and compliance. Manageability is about how easily you can manage resources, for example through a portal or automation.",
  },
  {
    topic: "cloud",
    question: "Which cloud benefit is mainly about keeping an application running with minimal downtime, for example by spreading it across multiple datacenters?",
    options: [
      "Cost predictability",
      "High availability",
      "Scalability",
      "Manageability",
    ],
    correctIndex: 1,
    explanation:
      "High availability means designing a service so it keeps running even when part of the system fails. Scalability is about adjusting to changing demand, cost predictability is about forecasting spending, and manageability is about how easy resources are to manage.",
  },
  // ---- Describe cloud service types ----
  {
    topic: "cloud",
    question: "A company wants to run its own custom web application but does not want to manage the operating system or servers. Which cloud service type fits best?",
    options: [
      "Infrastructure as a service (IaaS)",
      "Platform as a service (PaaS)",
      "Software as a service (SaaS)",
      "Private cloud",
    ],
    correctIndex: 1,
    explanation:
      "With PaaS the provider manages the servers, operating system and runtime, and you manage your application and its data. With IaaS you still manage the operating system and everything above it. SaaS is finished software you simply use, not a place to run your own custom app. Private cloud is a deployment model, not a service type.",
  },
  {
    topic: "cloud",
    question: "Which of these is an example of software as a service (SaaS)?",
    options: [
      "A web-based email service you use in a browser, with nothing to install or maintain",
      "A virtual machine where you install your own operating system",
      "A platform where you deploy your own application code",
      "A physical server in your own datacenter",
    ],
    correctIndex: 0,
    explanation:
      "SaaS is complete software delivered over the internet, where the provider handles everything behind it and you just use it. A virtual machine you configure yourself is IaaS. A platform for deploying your own code is PaaS. A server in your own datacenter is not a cloud service at all.",
  },

  // ============ Azure Architecture and Services (12) ============
  // ---- Core architectural components ----
  {
    topic: "architecture",
    question: "A company wants its application to keep running if one datacenter inside an Azure region has a failure. Which Azure feature is designed for this?",
    options: [
      "Resource locks",
      "Availability zones",
      "Management groups",
      "Azure Advisor",
    ],
    correctIndex: 1,
    explanation:
      "In regions that support them, availability zones are physically separate locations within a region, each with its own power, cooling and networking, so a failure in one does not take down the others. Resource locks only stop accidental changes or deletion. Management groups organize subscriptions. Azure Advisor gives recommendations but does not make an app resilient by itself.",
  },
  {
    topic: "architecture",
    question: "Which list shows Azure's organizing levels from the broadest to the narrowest?",
    options: [
      "Management group, subscription, resource group, resource",
      "Subscription, management group, resource, resource group",
      "Resource group, subscription, management group, resource",
      "Resource, resource group, management group, subscription",
    ],
    correctIndex: 0,
    explanation:
      "Management groups sit at the top and hold subscriptions. A subscription holds resource groups, and a resource group holds the individual resources, such as virtual machines or storage accounts. The other orders mix these levels up.",
  },
  {
    topic: "architecture",
    question: "What is the purpose of an Azure region pair?",
    options: [
      "To combine two regions into one billing area",
      "To link two regions in the same geography, supporting staggered updates and disaster recovery",
      "To automatically back up all your resources to a second region",
      "To limit a subscription to only two regions",
    ],
    correctIndex: 1,
    explanation:
      "Azure pairs regions within the same geography. Platform updates are rolled out to one region of a pair at a time, and in a widespread outage one region of each pair is prioritized for recovery. Pairing does not automatically back up your own resources, so you still need to set up replication or backup yourself. It has nothing to do with billing or limiting subscriptions.",
  },
  // ---- Compute and networking ----
  {
    topic: "architecture",
    question: "Which Azure compute option lets you run a small piece of code in response to an event, without managing servers?",
    options: [
      "Azure Virtual Machines",
      "Azure Functions",
      "Availability sets",
      "Azure Virtual Machine Scale Sets",
    ],
    correctIndex: 1,
    explanation:
      "Azure Functions is a serverless option: your code runs when a trigger fires, such as an HTTP request or a new file, and you do not manage the underlying servers. Virtual Machines and Virtual Machine Scale Sets are still virtual machines that you configure and maintain. An availability set is a way of spreading VMs across hardware to improve availability, not a way to run code.",
  },
  {
    topic: "architecture",
    question: "A company has two Azure virtual networks in different regions. Which feature lets resources in both networks communicate privately over Microsoft's backbone network?",
    options: [
      "Azure DNS",
      "Virtual network peering",
      "Azure Virtual Desktop",
      "Azure Blob Storage",
    ],
    correctIndex: 1,
    explanation:
      "Virtual network peering connects two virtual networks so traffic between them stays on Microsoft's private backbone and does not cross the public internet. It can link networks in different regions. Azure DNS resolves names to IP addresses, Azure Virtual Desktop delivers remote desktops, and Blob Storage stores unstructured data.",
  },
  {
    topic: "architecture",
    question: "Which service provides a private, dedicated connection between an on-premises network and Azure that does not travel over the public internet?",
    options: [
      "Azure VPN Gateway",
      "Azure ExpressRoute",
      "Azure DNS",
      "A subnet",
    ],
    correctIndex: 1,
    explanation:
      "ExpressRoute uses a connection through a connectivity provider, so traffic stays off the public internet. A VPN Gateway also connects networks securely, but it sends encrypted traffic over the public internet. Azure DNS resolves names, and a subnet is just a range of addresses inside a virtual network.",
  },
  // ---- Storage ----
  {
    topic: "architecture",
    question: "Which Azure Storage service is built for storing large amounts of unstructured data, such as images, videos and backups?",
    options: [
      "Azure Queue Storage",
      "Azure Table Storage",
      "Azure Blob Storage",
      "Azure Files",
    ],
    correctIndex: 2,
    explanation:
      "Blob Storage is designed for massive amounts of unstructured data such as images, video, documents and backups. Queue Storage holds messages that applications pass to each other. Table Storage keeps structured NoSQL data. Azure Files provides managed file shares that you mount like a network drive.",
  },
  {
    topic: "architecture",
    question: "Which redundancy option copies your data to a second region far from the first, to protect against a disaster that affects a whole region?",
    options: [
      "Locally redundant storage (LRS)",
      "Zone-redundant storage (ZRS)",
      "Geo-redundant storage (GRS)",
      "The Cool access tier",
    ],
    correctIndex: 2,
    explanation:
      "Geo-redundant storage keeps copies in the primary region and also replicates the data to a secondary region far away. LRS keeps all copies in one location, and ZRS spreads copies across availability zones but stays inside one region. The Cool access tier is about cost and how often data is accessed, not redundancy.",
  },
  {
    topic: "architecture",
    question: "Which blob access tier has the lowest storage cost but needs hours to retrieve data, making it suitable for long-term archives?",
    options: [
      "Hot",
      "Cool",
      "Archive",
      "Premium",
    ],
    correctIndex: 2,
    explanation:
      "The Archive tier stores data offline at the lowest storage cost, but data must be rehydrated before use, which can take hours. Hot is for frequently used data. Cool is for infrequently accessed data that you can still read immediately. Premium focuses on high performance and low latency, not low cost.",
  },
  // ---- Identity, access and security ----
  {
    topic: "architecture",
    question: "Which Azure service is a cloud-based identity and access management service that signs users in to Azure, Microsoft 365 and other applications?",
    options: [
      "Microsoft Entra ID",
      "Azure Policy",
      "Microsoft Defender for Cloud",
      "Azure Resource Manager",
    ],
    correctIndex: 0,
    explanation:
      "Microsoft Entra ID (formerly Azure Active Directory) manages users, groups and sign-in. Azure Policy checks that resources follow your rules. Defender for Cloud assesses and improves your security posture. Azure Resource Manager is the deployment and management layer for Azure resources.",
  },
  {
    topic: "architecture",
    question: "A contractor needs to view the resources in one resource group but must not be able to change or delete anything. Which feature lets you grant exactly this level of access?",
    options: [
      "Azure role-based access control (RBAC)",
      "Microsoft Entra Conditional Access",
      "Resource locks",
      "Azure Migrate",
    ],
    correctIndex: 0,
    explanation:
      "RBAC lets you assign a role, such as Reader, at a chosen scope like a single resource group, so the person can view but not modify. Conditional Access decides whether a sign-in is allowed based on conditions such as location or device, not what someone can do afterward. Resource locks block deletion or changes whatever a user's role, and are not about limiting what a person can view. Azure Migrate helps move workloads to Azure.",
  },
  {
    topic: "architecture",
    question: "Which security idea assumes that no user or device is automatically trusted and verifies every request, even from inside the company network?",
    options: [
      "Defense in depth",
      "The shared responsibility model",
      "Zero Trust",
      "The consumption-based model",
    ],
    correctIndex: 2,
    explanation:
      "Zero Trust follows the principle of verifying explicitly and never trusting a request just because it comes from inside the network. Defense in depth uses multiple layers of protection. The shared responsibility model describes who secures what between you and the cloud provider. The consumption-based model is about paying only for what you use.",
  },

  // ============ Azure Management and Governance (10) ============
  // ---- Cost management ----
  {
    topic: "governance",
    question: "Which tool lets you estimate the monthly cost of Azure services before you deploy them?",
    options: [
      "Azure Cost Management",
      "Azure pricing calculator",
      "Azure Advisor",
      "Azure Policy",
    ],
    correctIndex: 1,
    explanation:
      "The pricing calculator estimates what the services you plan to use will cost. Azure Cost Management looks at what you have actually spent after deploying, and helps you set budgets. Azure Advisor gives recommendations for resources that already exist. Azure Policy enforces rules and does not estimate costs.",
  },
  {
    topic: "governance",
    question: "A company wants to see how much each department spends on Azure. Which feature lets them label resources with name-value pairs, such as Department = Finance, so costs can be grouped?",
    options: [
      "Tags",
      "Resource locks",
      "Availability zones",
      "Azure Arc",
    ],
    correctIndex: 0,
    explanation:
      "Tags are name-value pairs you add to resources, resource groups or subscriptions to organize them and group costs in reports. Resource locks prevent deletion or changes. Availability zones are about keeping services running during failures. Azure Arc extends Azure management to resources outside Azure.",
  },
  // ---- Governance and compliance ----
  {
    topic: "governance",
    question: "A company wants to make sure every new resource is created only in approved regions. Which Azure service can enforce this rule?",
    options: [
      "Azure Policy",
      "Resource locks",
      "Microsoft Purview",
      "Azure Monitor",
    ],
    correctIndex: 0,
    explanation:
      "Azure Policy checks resources against rules you define, such as allowed locations, and can flag or block ones that do not comply. Resource locks protect resources from deletion or changes but do not enforce where they are created. Microsoft Purview is for governing data. Azure Monitor collects and analyzes telemetry.",
  },
  {
    topic: "governance",
    question: "An administrator wants to stop anyone from accidentally deleting an important resource group, whatever their permissions. What should they apply?",
    options: [
      "A resource lock",
      "Azure Policy",
      "A tag",
      "The Reader role",
    ],
    correctIndex: 0,
    explanation:
      "A delete lock stops a resource or resource group from being deleted, whatever role the person has, until the lock is removed. Azure Policy checks whether resources follow rules. A tag only labels a resource. The Reader role limits one user to viewing, but it does not protect the resource from people with higher roles.",
  },
  {
    topic: "governance",
    question: "Which Microsoft service helps an organization discover, classify and govern its data across on-premises, multicloud and SaaS sources?",
    options: [
      "Microsoft Purview",
      "Azure Advisor",
      "Azure Service Health",
      "Azure Resource Manager",
    ],
    correctIndex: 0,
    explanation:
      "Microsoft Purview is a data governance and compliance service that helps you find, classify and manage data wherever it lives. Azure Advisor recommends improvements for your Azure resources. Azure Service Health reports on Azure service issues. Azure Resource Manager is the layer used to deploy and manage Azure resources.",
  },
  // ---- Managing and deploying resources ----
  {
    topic: "governance",
    question: "Which Azure tool gives you a browser-based command line, already signed in, that supports both Azure CLI and Azure PowerShell?",
    options: [
      "Azure Arc",
      "Azure Cloud Shell",
      "Azure Advisor",
      "ARM templates",
    ],
    correctIndex: 1,
    explanation:
      "Azure Cloud Shell is a shell you open in your browser, already authenticated, where you can use Azure CLI or Azure PowerShell. Azure Arc extends Azure management to resources outside Azure. Azure Advisor gives recommendations. ARM templates are files that describe resources to deploy, not a command line.",
  },
  {
    topic: "governance",
    question: "A team wants to deploy the same set of Azure resources again and again, with identical results, from a file that describes what they want. Which approach is this?",
    options: [
      "Creating each resource by hand in the Azure portal",
      "Infrastructure as code (IaC)",
      "Applying tags to each resource",
      "Setting up a resource lock",
    ],
    correctIndex: 1,
    explanation:
      "Infrastructure as code describes your resources in a file, so you can deploy them repeatedly and consistently. In Azure, ARM templates are one way to do this, deployed through Azure Resource Manager. Clicking through the portal each time is slower and easier to get wrong. Tags only label resources, and locks only protect them.",
  },
  {
    topic: "governance",
    question: "Which service lets you manage servers and Kubernetes clusters that run outside Azure, such as on-premises or in another cloud, using Azure's management tools?",
    options: [
      "Azure Cloud Shell",
      "Azure Advisor",
      "Azure Arc",
      "Azure Service Health",
    ],
    correctIndex: 2,
    explanation:
      "Azure Arc brings resources that run outside Azure, such as on-premises servers and Kubernetes clusters, into Azure management so you can use tools like Azure Policy and tags on them. Cloud Shell is a command line in your browser. Advisor gives recommendations, and Service Health reports on Azure service issues.",
  },
  // ---- Monitoring ----
  {
    topic: "governance",
    question: "Which Azure service analyzes your existing resources and gives personalized recommendations to improve reliability, security, performance and cost?",
    options: [
      "Azure Monitor",
      "Azure Advisor",
      "Azure Service Health",
      "Microsoft Purview",
    ],
    correctIndex: 1,
    explanation:
      "Azure Advisor reviews how your resources are configured and used, then recommends ways to improve them. Azure Monitor collects and analyzes telemetry such as metrics and logs. Azure Service Health tells you about Azure service problems and planned maintenance that could affect you. Microsoft Purview is for data governance.",
  },
  {
    topic: "governance",
    question: "Which Azure service collects and analyzes metrics and logs from your applications and resources, and can send alerts when something goes wrong?",
    options: [
      "Azure Advisor",
      "Azure Policy",
      "Azure Monitor",
      "Azure Service Health",
    ],
    correctIndex: 2,
    explanation:
      "Azure Monitor gathers metrics and logs, supports analysis through tools such as Log Analytics, and can raise alerts. Azure Advisor gives recommendations but does not collect telemetry. Azure Policy enforces rules. Azure Service Health tells you about problems on the Azure platform itself, not the health of your own application.",
  },
];

// Exported so script.js can import them as ES modules.
export { TOPICS, QUESTIONS };
