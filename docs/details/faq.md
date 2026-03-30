# Frequently Asked Questions - Application Modernization

## Business Value & Strategy

### How will modernizing my Java applications help my business?

Modernizing your Java applications enables your business to become faster, more agile, and cost‑effective while reducing risk.

**Why modernization matters for the business:**

- **Accelerated time‑to‑market** – Cloud‑ready runtimes (e.g., Open Liberty) start in seconds and support continuous delivery, letting new features reach customers faster.
- **Improved operational efficiency** – Lightweight, modular servers consume fewer resources, lowering infrastructure costs and simplifying management.
- **Enhanced scalability & resilience** – Container‑native deployments on Kubernetes automatically scale with demand and isolate failures, supporting growth without major re‑architecting.
- **Future‑proof architecture** – Refactoring monoliths into micro‑services (using tools like Mono2Micro and Transformation Advisor) prepares applications for cloud‑native patterns, APIs, and AI‑driven services.
- **Risk mitigation & compliance** – Modern runtimes provide up‑to‑date security patches, standards compliance (Jakarta EE, MicroProfile), and easier monitoring, reducing exposure to vulnerabilities.
- **Better alignment with digital transformation** – Modernization supplies the data‑rich, API‑exposed foundation needed for analytics, AI, and omnichannel experiences that drive new revenue streams.

**References:**
- [IBM Application Modernization Accelerator](https://www.ibm.com/docs/en/ama?topic=about-application-modernization-accelerator)
- [Runtime Modernization & Cloud‑Native Java](https://openliberty.io/blog/2021/11/19/MonicaTamboli_MeetTheTeam.html)

---

### How much will it cost to modernize my Java applications?

IBM does not publish a fixed "price‑per‑application" for Java modernization; the cost is based on the amount of development effort required to migrate each application, plus any required licensing for the tools you use.

**How IBM calculates modernization cost:**

- **Effort‑based estimate** – The Application Modernization Accelerator (AMA) evaluates each app and provides an "application cost in days" that represents the estimated development effort to complete the migration.
- **Workspace‑level view** – AMA aggregates the effort for all apps in a workspace, showing total applications, average cost per application, common‑code effort, and unique‑code effort.
- **What the estimate does not include** – Testing of the new deployment, production‑level configuration, or ongoing operations must be budgeted separately.

**Bottom‑line guidance:**

- No public price list – IBM's pricing for modernization tools is negotiated per customer.
- Use AMA's effort estimate as the primary basis for budgeting.
- Reach out to IBM Sales for the exact license cost for Application Modernization Accelerator and Developer Tools.

**References:**
- [IBM Application Modernization Accelerator Developer Tools](https://www.ibm.com/docs/en/ama-dev-tools?topic=overview)
- [Understanding Costs in the AMA UI](https://www.ibm.com/docs/en/ama?topic=accelerator-finding-your-way-around-ui)

---

## WebSphere Modernization

### I need to modernize my applications running on WebSphere. What are my options?

Modernizing WebSphere‑based Java applications can be done in three main ways:

#### 1. Modernize to Liberty (runtime modernization)

**What it does:** Moves your existing WebSphere Application Server (traditional) code to the IBM WebSphere Application Server Liberty runtime. The application code stays largely unchanged; only configuration, Java version and library references are updated.

**When to choose it:** You want a quick lift‑and‑shift to a lightweight, cloud‑ready runtime, keep the same architecture, and gain faster start‑up, lower resource consumption, and easier Kubernetes deployment.

#### 2. Modernize to MoRE (Managed Liberty under WebSphere administration)

**What it does:** Deploys Liberty‑based applications managed by WebSphere Hybrid Edition using the Modernized Runtime Extension for Java (MoRE). The runtime runs Liberty, but you retain familiar WebSphere admin tools.

**When to choose it:** You need runtime modernization while preserving existing WebSphere operational practices and want a smoother transition for operations teams.

#### 3. Transform to Microservices / Cloud‑Native architecture

**What it does:** Goes beyond runtime change—refactors the monolithic WebSphere application into independent microservices that run on Open Liberty and use MicroProfile APIs.

**When to choose it:** You aim for maximum agility, scalability, and DevOps enablement, want to adopt a cloud‑native architecture, or need to expose APIs for new digital channels.

**References:**
- [Application Modernization Accelerator Developer Tools](https://www.ibm.com/docs/en/ama-dev-tools?topic=overview)
- [Modernizing Java applications](https://www.ibm.com/docs/en/ama-dev-tools?topic=modernizing-java-applications)
- [Accessing a trial and evaluating MoRE](https://www.ibm.com/docs/en/more?topic=more-accessing-trial-evaluating)

---

### How can I modernize from WebSphere to Liberty?

Modernizing can be done in three logical stages:

#### 1. Assessment – understand what you have

1. Install the AMA discovery tool on the host where the WebSphere server is running
2. Run the collector to scan every EAR/WAR
3. Upload the collected data to the Application Modernization Accelerator UI
4. Review the portfolio view showing business value, complexity rating, and estimated effort

#### 2. Generate a migration bundle

1. Install the AMA Developer Tools for your IDE (VS Code, Eclipse, or IntelliJ)
2. Right‑click the project and choose **Modernize Java Applications → Modernize to Liberty**
3. Upload the migration plan
4. Fix the reported issues directly in the IDE
5. AMA produces a migration bundle with server.xml, Containerfile, and configuration fragments

#### 3. Deploy the modernized application

**On‑premises or VM:**
- Install WebSphere Liberty
- Copy the generated server.xml
- Place the application EAR/WAR in the dropins/ directory
- Start the server

**Container / Kubernetes:**
- Use the generated Containerfile to build a Docker image
- Push to your container registry
- Deploy with the WebSphere Liberty Operator

**Optional: MoRE:**
- Install MoRE via IBM Installation Manager
- Create a WebSphere ND cell profile
- Deploy to the managed Liberty server

**References:**
- [Application Modernization Accelerator Developer Tools](https://www.ibm.com/docs/en/ama-dev-tools?topic=overview)
- [Modernizing Java applications workflow](https://www.ibm.com/docs/en/ama-dev-tools?topic=modernizing-java-applications)
- [Installing MoRE](https://www.ibm.com/docs/en/more?topic=more-accessing-trial-evaluating)

---

## Liberty

### What is Liberty?

IBM WebSphere Application Server Liberty (often just called Liberty) is a lightweight, modular Java runtime built on the open‑source Open Liberty project.

**Core characteristics:**

- **Modular feature model** – Enable only the Java EE / Jakarta EE, MicroProfile, or custom features your application needs
- **Fast startup & low footprint** – Liberty boots in seconds and consumes far fewer CPU‑/memory resources than traditional WebSphere
- **Cloud‑native ready** – Runs natively in Docker/Kubernetes with container image builds
- **Standards compliance** – Fully compatible with Jakarta EE 9/10 and MicroProfile
- **Security & observability** – Built‑in TLS, role‑based access control, audit logging
- **Continuous updates** – Four‑week release cadence delivers the latest security patches

**When to use Liberty:**

- Modernizing WebSphere apps
- Building microservices
- Hybrid environments (on‑prem, private cloud, or public cloud)
- Operational consistency with Liberty Operator or MoRE

**References:**
- [WebSphere Application Server Liberty overview](https://www.ibm.com/docs/en/was-liberty/base?topic=liberty-overview)
- [Liberty features](https://www.ibm.com/docs/en/was-liberty/base?topic=management-liberty-features)

---

### What are the benefits of using Liberty?

**Technical benefits:**

- **Fast startup & low resource usage** – Boots in seconds with smaller memory/CPU footprint
- **Modular feature model** – Enable only required features, reducing attack surface
- **Cloud‑native readiness** – Native Docker/Kubernetes support with Open Liberty Operator
- **Standards compliance** – Full Jakarta EE 9/10 and MicroProfile compatibility
- **Continuous security updates** – Four‑week release cycle with latest patches
- **Observability & monitoring** – Native metrics, health checks, and logging hooks

**Business / operational benefits:**

- **Reduced infrastructure cost** – Lower CPU‑/memory consumption means fewer VMs or smaller containers
- **Faster time‑to‑market** – Quick start‑up enables rapid iteration and faster feature delivery
- **Simplified operations** – Modular approach and single‑file configuration lower complexity
- **Portability across environments** – Same runtime runs on‑prem, private cloud, or public cloud
- **Risk mitigation** – Smaller attack surface and regular security fixes reduce vulnerability exposure

**References:**
- [WebSphere Application Server Liberty overview](https://www.ibm.com/docs/en/was-liberty/base?topic=liberty-overview)
- [Liberty features](https://www.ibm.com/docs/en/was-liberty/base?topic=management-liberty-features)

---

### Is Liberty better than Tomcat?

**Short answer:** Yes—Liberty typically delivers faster start‑up, smaller memory footprint, higher throughput, built‑in enterprise features, and seamless cloud‑native support compared to Apache Tomcat.

**Performance comparison (based on IBM‑published data):**

| Aspect | Liberty | Tomcat |
|--------|---------|--------|
| Startup time | ~1 second (cold) | Several seconds to tens of seconds |
| Memory usage | 1.3× – 2.9× less memory | Higher memory consumption |
| Throughput | ~2× higher request‑per‑second | Lower throughput under identical load |
| Modularity | Feature‑driven, load only what you need | Monolithic, all components always present |
| Enterprise features | Built‑in TLS, RBAC, LDAP/SSO, audit logging | Requires add‑ons or external libraries |
| Cloud‑native tooling | Docker/OCI image generation, Liberty Operator | No native operator, manual containerization |
| Release cadence | New release every 4 weeks | Community releases, no guaranteed enterprise support |

**Business impact:**

- **Cost savings** – Lower RAM and higher throughput mean fewer VM or container instances
- **Faster delivery** – Sub‑second startup accelerates CI/CD pipelines
- **Reduced risk** – Smaller attack surface and frequent security updates
- **Simplified ops** – One runtime provides both Java EE/MicroProfile support and built‑in security/observability

**References:**
- [WebSphere Application Server Liberty overview](https://www.ibm.com/docs/en/was-liberty/base?topic=liberty-overview)
- [Liberty performance benchmark vs. Tomcat](https://openliberty.io/blog/2022/10/17/memory-footprint-throughput-update.html)

---

### Am I entitled to use Liberty?

Yes – you can use Liberty, but the entitlement depends on which IBM product you have licensed.

**How entitlement works:**

| Liberty variant | How you become entitled | What you get |
|----------------|------------------------|--------------|
| **WebSphere Application Server Liberty** | Included automatically with any WebSphere Application Server (traditional) or WebSphere Application Server Network Deployment license | Full IBM support and access to IBM‑provided updates |
| **Open Liberty** | Free and open‑source – no license required | Free software, but IBM support only with a supporting WebSphere license |
| **Liberty administered from WebSphere (MoRE)** | Requires the same WebSphere Application Server entitlement | Adds MoRE operator, managed‑Liberty servers, and WebSphere admin tools |
| **Enterprise Application Runtimes / Cloud Pak for Applications** | Entitlement to IBM Enterprise Application Runtimes or IBM Cloud Pak for Applications | WebSphere Liberty Core for container‑native environments |

**Summary:**

- **Open Liberty** = free to use, no entitlement required (support only with paid WebSphere license)
- **WebSphere Liberty** = automatically entitled with WebSphere Application Server or Enterprise Application Runtimes license
- **MoRE** = covered by the same WebSphere entitlement

**References:**
- [Licensing for WebSphere Application Server Liberty base](https://www.ibm.com/docs/en/was-liberty/base?topic=overview-licensing-liberty)
- [WebSphere Application Server Liberty overview](https://www.ibm.com/docs/en/was-liberty/base?topic=liberty-overview)

---

### How is Liberty different to WebSphere?

Liberty is a lightweight, modular, cloud‑native Java runtime that boots in seconds, uses far less memory, and receives security updates every four weeks. Traditional WebSphere is a monolithic, heavyweight server that loads the full Java EE stack, starts slower, consumes more resources, and updates less frequently.

**Key differences:**

| Aspect | Traditional WebSphere | Liberty |
|--------|----------------------|---------|
| **Runtime core** | Monolithic, all‑inclusive kernel | Modular – tiny kernel plus features you enable |
| **Start‑up time** | Seconds to minutes | Sub‑second to a few seconds |
| **Memory footprint** | Large | 1.3× – 2.9× less memory |
| **Update cadence** | Major releases every few years | Four‑week release cycle |
| **Configuration** | Large server.xml with many defaults | Minimal server.xml—only enabled features |
| **Container readiness** | Requires custom Dockerfiles | Generates Containerfile automatically |
| **Kubernetes operator** | No native operator | WebSphere Liberty Operator available |

**When to choose Liberty:**

- New cloud‑native projects
- Microservices
- Any scenario where speed, resource efficiency, and continuous updates matter
- Existing WAS customers can use MoRE to preserve admin practices while gaining Liberty benefits

**References:**
- [WebSphere Application Server Liberty overview](https://www.ibm.com/docs/en/was-liberty/base?topic=liberty-overview)
- [Performance benchmark](https://openliberty.io/blog/2022/10/17/memory-footprint-throughput-update.html)
- [Liberty features](https://www.ibm.com/docs/en/was-liberty/base?topic=management-liberty-features)

---

## IBM Tools & Products

### What is Application Modernization Accelerator?

IBM Application Modernization Accelerator (AMA) is an IBM‑provided assessment and automation platform that helps you discover, evaluate, and modernize on‑premises Java applications so they can run on cloud‑native runtimes such as Liberty, MoRE, or container platforms.

**What AMA does:**

| Phase | Key capabilities |
|-------|-----------------|
| **Discovery & Assessment** | Scans application servers and builds detailed inventory of each EAR/WAR, evaluates business value, migration complexity, and potential issues |
| **Strategic Planning** | Highlights which applications should be replaced, upgraded, or refactored; estimates development effort (days) needed for migration |
| **Execution & Automation** | Generates migration bundle with server.xml, Containerfile, and dependencies list |
| **Integration with Developer Tools** | Works with AMA Developer Tools (VS Code, Eclipse, IntelliJ) to launch "Modernize to Liberty" from your IDE |
| **Support for Cloud & Hybrid** | Included with IBM WebSphere Hybrid Edition for automated container deployment |

**Why you would use AMA:**

- **Rapid insight** – Quickly understand portfolio size, complexity, and business impact
- **Cost‑estimate guidance** – Provides development days estimate for budgeting
- **Automation** – Produces ready‑to‑deploy artifacts that cut manual effort
- **Path selection** – Helps decide between runtime modernization or architectural transformation

**References:**
- [Application Modernization Accelerator Developer Tools](https://www.ibm.com/docs/en/ama-dev-tools?topic=overview)
- [IBM Application Modernization Accelerator](https://www.ibm.com/docs/en/ama?topic=about-application-modernization-accelerator)

---

### What is EASeJ?

IBM Enterprise Application Service for Java (EASeJ) is IBM's fully managed, cloud‑native platform that lets you run Java (Jakarta EE, MicroProfile, and Spring Boot) applications as containerized services without managing the underlying runtime infrastructure.

**Core purpose:**

- Provide a "PaaS‑style" environment for Java workloads (WAR, EAR, or executable JAR)
- Automatically handle container creation, scaling, and lifecycle management
- Deliver built‑in observability, security, and DevOps integration

**Key capabilities:**

- **Managed Liberty runtime** – Runs Open Liberty or WebSphere Liberty in containers automatically
- **Environment configuration via environment.yaml** – Define resources, scaling rules, buildpack
- **Git‑driven deployment** – Connect to GitHub repository; each push triggers automatic redeployment
- **Logging & observability** – Platform logs available through IBM Cloud Logs
- **Scalable containers** – Automatically creates Kubernetes‑style pods with health‑checks
- **Security integration** – Supports TLS, IAM‑based access control, and IBM Cloud identity services

**When to choose EASeJ:**

- You want to run Java applications in the cloud without managing servers or Kubernetes clusters
- You need automatic updates to the Liberty runtime handled by IBM
- Your organization prefers Git‑centric CI/CD and single‑pane‑of‑glass platform

**References:**
- [Logging for EASeJ with IBM Cloud Logs](https://www.ibm.com/docs/en/ease?topic=observability-logging-cloud-logs)
- [Configuring the environment.yaml file](https://www.ibm.com/docs/en/ease?topic=configuring-environmentyaml-file-easej-tools)

---

### What is MoRE?

IBM Modernized Runtime Extension for Java (MoRE) is an IBM‑provided runtime extension that lets you run Liberty‑based Java applications while still using the familiar WebSphere Application Server (WAS) administrative model.

**What MoRE does:**

- **Deploys Liberty inside a WebSphere ND cell** – Liberty servers are created and managed as resources of a traditional WebSphere ND profile
- **Provides unified admin experience** – Use the same WebSphere console, cell‑profile tools, and deployment scripts
- **Adds Liberty capabilities to WebSphere** – Applications gain lightweight, modular, cloud‑ready features while remaining under WebSphere governance

**Key technical features:**

- **Supported standards** – Java SE 17 and Jakarta EE 10 Core Profile
- **Installation** – Via IBM Installation Manager; registers Liberty runtime with WebSphere ND cell
- **Managed Liberty server** – Create inside the cell, configure with server.xml, deploy using regular WebSphere mechanisms
- **Operational continuity** – Existing WebSphere processes (security realms, transaction recovery, clustering) continue to work

**When to use MoRE:**

- You want Liberty's performance and cloud‑native benefits but must retain WebSphere‑style administration
- Hybrid or phased migration scenarios
- Regulatory or compliance constraints requiring IBM‑supported enterprise‑grade administration tools

**References:**
- [MoRE overview](https://www.ibm.com/docs/en/more?topic=more-accessing-trial-evaluating)
- [Installing MoRE with Installation Manager](https://www.ibm.com/docs/en/more?topic=more-accessing-trial-evaluating)
- [Understanding Liberty administered from WebSphere](https://www.ibm.com/docs/en/ama?topic=accelerator-understanding-liberty-administered-from-websphere-more)

---

## Product Comparisons

### What are the differences between EASeJ, MoRE, Liberty, and WebSphere Application Server?

These are four distinct IBM offerings that address different points on the spectrum from managed PaaS to self‑hosted runtime.

**High‑level purpose:**

| Product | What it delivers | Primary audience |
|---------|-----------------|------------------|
| **EASeJ** | Fully managed, cloud‑native PaaS running Java applications as container‑based services | Teams wanting "code‑only" deployment with IBM handling the runtime |
| **MoRE** | Liberty server inside WebSphere ND cell, keeping existing WebSphere admin tools | Organizations retaining WebSphere governance while gaining Liberty benefits |
| **Liberty** | Lightweight, modular Java EE/Jakarta EE/MicroProfile runtime you install and manage | Developers and ops teams building cloud‑native microservices with direct runtime control |
| **Traditional WAS** | Full‑stack, monolithic Java EE application server | Legacy enterprises with long‑standing WAS installations |

**Quick decision guide:**

- Want to offload runtime management? → **EASeJ**
- Need to keep WebSphere administrative processes? → **MoRE**
- Need lightweight, modular runtime you can run anywhere? → **Liberty**
- Stuck with legacy Java EE server and cannot change admin model? → **Traditional WebSphere**

**References:**
- [WebSphere Application Server Liberty overview](https://www.ibm.com/docs/en/was-liberty/base?topic=liberty-overview)
- [MoRE overview](https://www.ibm.com/docs/en/more?topic=more-accessing-trial-evaluating)
- [Licensing for WebSphere Application Server Liberty](https://www.ibm.com/docs/en/was-liberty/base?topic=overview-licensing-liberty)

---

## Additional Resources

- [IBM Application Modernization Accelerator Documentation](https://www.ibm.com/docs/en/ama)
- [WebSphere Liberty Documentation](https://www.ibm.com/docs/en/was-liberty)
- [Open Liberty](https://openliberty.io/)
- [IBM Cloud Pak for Applications](https://www.ibm.com/cloud/cloud-pak-for-applications)
