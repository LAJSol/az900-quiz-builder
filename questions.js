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
    description: "Cloud models, consumption-based pricing, and the benefits of cloud services.",
    icon: "☁",
  },
  {
    key: "architecture",
    title: "Azure Architecture and Services",
    description: "Compute, storage, networking, and the core building blocks of Azure.",
    icon: "◈",
  },
  {
    key: "governance",
    title: "Azure Management and Governance",
    description: "Subscriptions, resource groups, cost management, and compliance tooling.",
    icon: "⚖",
  },
];

/**
 * The question bank. 3 placeholder questions per topic — replace these
 * with your own content while keeping the same object shape.
 */
const QUESTIONS = [
  // ----------------------- Cloud Concepts -----------------------
  {
    topic: "cloud",
    question: "Which cloud deployment model gives you full control over the hardware but requires you to maintain it yourself?",
    options: [
      "Public cloud",
      "Private cloud",
      "Hybrid cloud",
      "Multi-cloud",
    ],
    correctIndex: 1,
    explanation:
      "Private cloud is operated solely for one organization, often on-premises, giving maximum control over hardware and data. Public cloud is shared infrastructure managed by a provider (so less control). Hybrid combines public and private but does not give full control over the public part. Multi-cloud simply means using multiple public providers and is not a control/maintenance model.",
  },
  {
    topic: "cloud",
    question: "What is a defining characteristic of the consumption-based pricing model in the cloud?",
    options: [
      "You pay a fixed monthly fee regardless of usage",
      "You pay only for the resources you actually use",
      "You must commit to a yearly contract",
      "You purchase hardware upfront",
    ],
    correctIndex: 1,
    explanation:
      "Consumption-based pricing means you pay for what you use and can stop paying when you stop using a resource. A fixed monthly fee describes a traditional subscription, not consumption pricing. A yearly contract or upfront hardware purchase is the opposite of the flexible, on-demand model the cloud provides.",
  },
  {
    topic: "cloud",
    question: "Which of the following is considered an advantage of moving to a public cloud service?",
    options: [
      "You must buy and rack your own servers",
      "The cloud provider handles hardware maintenance",
      "You lose all responsibility for your data's security",
      "You cannot scale resources up or down",
    ],
    correctIndex: 1,
    explanation:
      "A key benefit of public cloud is that the provider owns and maintains the physical hardware, reducing your maintenance burden. Buying/racking servers is an on-premises responsibility, not a cloud advantage. The shared responsibility model still leaves you responsible for securing your data. The cloud is specifically designed to scale up and down easily.",
  },

  // ----------------- Azure Architecture and Services -----------------
  {
    topic: "architecture",
    question: "Which Azure service provides virtual machines you can use to run your own operating systems and applications?",
    options: [
      "Azure Virtual Machines",
      "Azure Blob Storage",
      "Azure Key Vault",
      "Azure DNS",
    ],
    correctIndex: 0,
    explanation:
      "Azure Virtual Machines gives you on-demand compute where you choose the OS image. Blob Storage is for unstructured object data, not running applications. Key Vault stores secrets and keys. DNS manages name resolution. Only Virtual Machines provides general-purpose compute with an OS you control.",
  },
  {
    topic: "architecture",
    question: "What is the primary purpose of Azure Storage Accounts?",
    options: [
      "To host virtual machines",
      "To provide a container for data services like blobs, files, and queues",
      "To manage user identities",
      "To route network traffic",
    ],
    correctIndex: 1,
    explanation:
      "A Storage Account is the top-level container that exposes data services such as Blob, Files, Queues, and Tables. VMs run on compute resources, not storage accounts. User identities are managed by Microsoft Entra ID. Network traffic is handled by services such as Azure Load Balancer or Azure Virtual Network, not Storage Accounts (Azure DNS handles name resolution).",
  },
  {
    topic: "architecture",
    question: "Which option best describes an Azure region?",
    options: [
      "A set of datacenters deployed within a latency-defined perimeter and connected through a regional network",
      "A single physical datacenter anywhere in the world",
      "A geographic area containing exactly one availability zone",
      "A subscription boundary for billing",
    ],
    correctIndex: 0,
    explanation:
      "A region is one or more datacenters connected via a low-latency regional network. A single datacenter is not the full definition. Regions typically contain multiple (usually three) availability zones, not one. A subscription is a billing/management boundary and is unrelated to the physical region concept.",
  },

  // ----------------- Azure Management and Governance -----------------
  {
    topic: "governance",
    question: "Which Azure service helps you enforce organizational rules and conventions over your Azure resources?",
    options: [
      "Azure Policy",
      "Azure Advisor",
      "Azure DevOps",
      "Azure Virtual Network",
    ],
    correctIndex: 0,
    explanation:
      "Azure Policy lets you create and assign policies that enforce rules (e.g., allowed regions, tagging) on resources. Advisor offers recommendations but does not enforce rules. DevOps is a CI/CD toolchain. Virtual Network provides networking and is not a governance tool.",
  },
  {
    topic: "governance",
    question: "What is the purpose of a resource group in Azure?",
    options: [
      "To act as a lifecycle container that groups related Azure resources",
      "To provide a billing subscription",
      "To grant administrative access to users",
      "To replicate data across regions",
    ],
    correctIndex: 0,
    explanation:
      "A resource group is a logical container that holds related resources so they can be managed, monitored, and deleted together as a unit. Billing is handled at the subscription level. Access is granted via Microsoft Entra ID roles, not resource groups themselves. Replication is a feature of specific services, not of resource groups.",
  },
  {
    topic: "governance",
    question: "Which tool would you use to estimate the cost of Azure resources before you deploy them?",
    options: [
      "Azure Cost Management",
      "Azure Pricing Calculator",
      "Azure Advisor",
      "Azure Blueprints",
    ],
    correctIndex: 1,
    explanation:
      "The Azure Pricing Calculator lets you configure resources and see estimated costs before deploying. Cost Management analyzes and tracks spend for resources already deployed. Advisor gives best-practice recommendations, not cost estimates. Blueprints package governance artifacts, not pricing.",
  },
];

// Exported so script.js can import them as ES modules.
export { TOPICS, QUESTIONS };
