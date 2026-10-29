import type { Locale } from "../i18n";

export type DriveInline =
  | string
  | { code: string }
  | { strong: string }
  | { link: string; path: string }
  | { external: string; href: string }
  | { email: true };

type DriveBlock =
  | { type: "paragraph"; parts: DriveInline[] }
  | { type: "list"; items: DriveInline[][] };

type DrivePageCopy = {
  title: string;
  description: string;
  sections: { title: string; blocks: DriveBlock[] }[];
  closing?: string;
};

export const driveMcpCopy: Record<Locale, { updated: string; home: DrivePageCopy; privacy: DrivePageCopy }> = {
  en: {
    updated: "October 29, 2026",
    home: {
      title: "Drive MCP Server",
      description:
        "Drive MCP Server is a private Google Cloud app that connects Juan Silva's own Google Drive to his encrypted server backups and his AI agents.",
      sections: [
        {
          title: "What this app is",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "Drive MCP Server is the name of a private app I registered in Google Cloud. It connects my own Google Drive to two tools I run for myself. It is not a product or a public service: only my own Google account signs in to it, and there is nothing here to sign up for.",
              ],
            },
          ],
        },
        {
          title: "What it is used for",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { strong: "Encrypted backups." },
                  " My home server backs itself up to a single folder in my Google Drive. The backup software (restic, through rclone) encrypts the data on the server before upload, so Google stores only encrypted data. Permission: ",
                  { code: "drive.file" },
                  ", which reaches only the files this app creates or that I open with it.",
                ],
                [
                  { strong: "My AI agents." },
                  " My own AI coding agents can use my Drive through Google's Drive MCP server: they can read my files (",
                  { code: "drive.readonly" },
                  ") and create or change only files made with this app (",
                  { code: "drive.file" },
                  ").",
                ],
              ],
            },
          ],
        },
        {
          title: "Who can use it",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "Only me. The app's only user is my own Google account. If that ever changes, I will update this page and the privacy policy before anyone else connects.",
              ],
            },
          ],
        },
        {
          title: "Privacy",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "How the app handles Google user data is described in the ",
                { link: "Drive MCP Server Privacy Policy", path: "/apps/drive-mcp/privacy/" },
                ".",
              ],
            },
          ],
        },
        {
          title: "Contact",
          blocks: [{ type: "paragraph", parts: ["Questions about this app: ", { email: true }, "."] }],
        },
      ],
      closing:
        "Google Drive is a trademark of Google LLC. This app is a personal project and is not affiliated with or endorsed by Google.",
    },
    privacy: {
      title: "Drive MCP Server Privacy Policy",
      description:
        "How Drive MCP Server, Juan Silva's private Google Cloud app, accesses, uses and stores Google user data.",
      sections: [
        {
          title: "1. Scope",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "This policy covers Drive MCP Server, the private Google Cloud app described on the ",
                { link: "Drive MCP Server page", path: "/apps/drive-mcp/" },
                ". It applies only to the Google user data the app accesses. This website's general ",
                { link: "Privacy Policy", path: "/privacy-policy/" },
                " covers the website itself.",
              ],
            },
          ],
        },
        {
          title: "2. Who uses the app",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "The app has one user: me, Juan Silva, with my own Google account. It accesses no one else's Google data. If that changes, I will update this policy before anyone else connects.",
              ],
            },
          ],
        },
        {
          title: "3. Data the app accesses",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { code: "drive.file" },
                  ": the files this app creates in my Drive, or that I open with it. The server backup uses only this permission.",
                ],
                [
                  { code: "drive.readonly" },
                  ": read-only access to the files in my Drive, used by my own AI agents through Google's Drive MCP server.",
                ],
              ],
            },
          ],
        },
        {
          title: "4. How the data is used",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { strong: "Backups." },
                  " My home server writes encrypted backup files to one Drive folder and reads them back to check or restore them. The files are encrypted on the server before upload, and the encryption password is never sent to Google.",
                ],
                [
                  { strong: "AI agents." },
                  " When I ask one of my AI agents for something that needs a file from my Drive, the agent reads that file through Google's Drive MCP server and uses it to answer me.",
                ],
              ],
            },
            {
              type: "paragraph",
              parts: [
                "The data is used only for these two purposes, in my own work. It is not used for advertising, not sold, and not used to build profiles.",
              ],
            },
          ],
        },
        {
          title: "5. Where the data goes",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { strong: "Backups." },
                  " The encrypted backup files are stored in my Google Drive. Nothing else receives them.",
                ],
                [
                  { strong: "AI agents." },
                  " To answer my request, the agent sends the content it read to the AI model provider behind that agent (for example Google, Anthropic or OpenAI), under my own account with that provider. That provider's terms and privacy policy apply to it.",
                ],
              ],
            },
            {
              type: "paragraph",
              parts: [
                "No one else receives Google user data through this app, and none of it is sold or shared for advertising.",
              ],
            },
          ],
        },
        {
          title: "6. Storage and retention",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { strong: "Backups." },
                  " The encrypted backup files stay in my Google Drive until I or the backup software delete them.",
                ],
                [
                  { strong: "AI agents." },
                  " Content an agent reads can stay in that agent's session history and in my own work files on my own computers, and with the model provider under its terms.",
                ],
              ],
            },
          ],
        },
        {
          title: "7. Revoking access",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "Access can be revoked at any time on the Google Account's ",
                { external: "third-party connections page", href: "https://myaccount.google.com/connections" },
                ". Revoking it stops both the backup and the agents from reaching Drive.",
              ],
            },
          ],
        },
        {
          title: "8. Changes",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "If the app's use of Google data changes, I will update this policy and its date before the change takes effect.",
              ],
            },
          ],
        },
        {
          title: "9. Contact",
          blocks: [{ type: "paragraph", parts: ["Questions about this policy: ", { email: true }, "."] }],
        },
      ],
    },
  },
  pt: {
    updated: "29 de outubro de 2026",
    home: {
      title: "Drive MCP Server",
      description:
        "Drive MCP Server é um app privado no Google Cloud que conecta o Google Drive de Juan Silva aos backups criptografados do servidor dele e aos agentes de IA dele.",
      sections: [
        {
          title: "O que é este app",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "Drive MCP Server é o nome de um app privado que registrei no Google Cloud. Ele conecta o meu próprio Google Drive a duas ferramentas que rodo só para mim. Não é um produto nem um serviço público: só a minha conta Google entra nele, e aqui não há cadastro.",
              ],
            },
          ],
        },
        {
          title: "Para que ele serve",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { strong: "Backups criptografados." },
                  " Meu servidor doméstico faz backup de si mesmo em uma única pasta do meu Google Drive. O software de backup (restic, via rclone) criptografa os dados no próprio servidor antes do envio, então o Google guarda só dados criptografados. Permissão: ",
                  { code: "drive.file" },
                  ", que alcança apenas os arquivos que este app cria ou que eu abro com ele.",
                ],
                [
                  { strong: "Meus agentes de IA." },
                  " Meus próprios agentes de IA de programação podem usar o meu Drive pelo servidor Drive MCP do Google: eles podem ler os meus arquivos (",
                  { code: "drive.readonly" },
                  ") e criar ou alterar apenas os arquivos feitos com este app (",
                  { code: "drive.file" },
                  ").",
                ],
              ],
            },
          ],
        },
        {
          title: "Quem pode usar",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "Só eu. O único usuário do app é a minha própria conta Google. Se isso mudar, atualizo esta página e a política de privacidade antes que qualquer outra pessoa se conecte.",
              ],
            },
          ],
        },
        {
          title: "Privacidade",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "A forma como o app trata dados de usuário do Google está descrita na ",
                { link: "política de privacidade do Drive MCP Server", path: "/apps/drive-mcp/privacy/" },
                ".",
              ],
            },
          ],
        },
        {
          title: "Contato",
          blocks: [{ type: "paragraph", parts: ["Dúvidas sobre este app: ", { email: true }, "."] }],
        },
      ],
      closing:
        "Google Drive é uma marca da Google LLC. Este app é um projeto pessoal, não é afiliado ao Google nem endossado por ele.",
    },
    privacy: {
      title: "Política de privacidade do Drive MCP Server",
      description:
        "Como o Drive MCP Server, app privado de Juan Silva no Google Cloud, acessa, usa e guarda dados de usuário do Google.",
      sections: [
        {
          title: "1. Abrangência",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "Esta política cobre o Drive MCP Server, o app privado do Google Cloud descrito na ",
                { link: "página do Drive MCP Server", path: "/apps/drive-mcp/" },
                ". Ela vale só para os dados de usuário do Google que o app acessa. A ",
                { link: "Política de Privacidade", path: "/privacy-policy/" },
                " geral deste site cobre o próprio site.",
              ],
            },
          ],
        },
        {
          title: "2. Quem usa o app",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "O app tem um único usuário: eu, Juan Silva, com a minha própria conta Google. Ele não acessa dados do Google de mais ninguém. Se isso mudar, atualizo esta política antes que qualquer outra pessoa se conecte.",
              ],
            },
          ],
        },
        {
          title: "3. Dados que o app acessa",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { code: "drive.file" },
                  ": os arquivos que este app cria no meu Drive ou que eu abro com ele. O backup do servidor usa só esta permissão.",
                ],
                [
                  { code: "drive.readonly" },
                  ": acesso somente leitura aos arquivos do meu Drive, usado pelos meus próprios agentes de IA pelo servidor Drive MCP do Google.",
                ],
              ],
            },
          ],
        },
        {
          title: "4. Como os dados são usados",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { strong: "Backups." },
                  " Meu servidor doméstico grava arquivos de backup criptografados em uma pasta do Drive e os lê de volta para conferi-los ou restaurá-los. Eles são criptografados no servidor antes do envio, e a senha de criptografia nunca é enviada ao Google.",
                ],
                [
                  { strong: "Agentes de IA." },
                  " Quando peço a um dos meus agentes de IA algo que precisa de um arquivo do meu Drive, o agente lê esse arquivo pelo servidor Drive MCP do Google e o usa para me responder.",
                ],
              ],
            },
            {
              type: "paragraph",
              parts: [
                "Os dados são usados só para essas duas finalidades, no meu próprio trabalho. Eles não são usados para publicidade, não são vendidos e não servem para criar perfis.",
              ],
            },
          ],
        },
        {
          title: "5. Para onde os dados vão",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { strong: "Backups." },
                  " Os arquivos de backup criptografados ficam no meu Google Drive. Nenhum outro destino os recebe.",
                ],
                [
                  { strong: "Agentes de IA." },
                  " Para responder ao meu pedido, o agente envia o conteúdo que leu ao provedor do modelo de IA por trás dele (por exemplo Google, Anthropic ou OpenAI), na minha própria conta com esse provedor. Os termos e a política de privacidade desse provedor se aplicam a esse envio.",
                ],
              ],
            },
            {
              type: "paragraph",
              parts: [
                "Ninguém mais recebe dados de usuário do Google por meio deste app, e nenhum deles é vendido ou compartilhado para publicidade.",
              ],
            },
          ],
        },
        {
          title: "6. Armazenamento e retenção",
          blocks: [
            {
              type: "list",
              items: [
                [
                  { strong: "Backups." },
                  " Os arquivos de backup criptografados ficam no meu Google Drive até que eu ou o software de backup os apague.",
                ],
                [
                  { strong: "Agentes de IA." },
                  " O conteúdo que um agente lê pode ficar no histórico de sessão desse agente e nos meus próprios arquivos de trabalho, nos meus computadores, e no provedor do modelo, conforme os termos dele.",
                ],
              ],
            },
          ],
        },
        {
          title: "7. Como revogar o acesso",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "O acesso pode ser revogado a qualquer momento na ",
                { external: "página de conexões com apps de terceiros", href: "https://myaccount.google.com/connections" },
                " da Conta do Google. Revogar impede tanto o backup quanto os agentes de acessar o Drive.",
              ],
            },
          ],
        },
        {
          title: "8. Alterações",
          blocks: [
            {
              type: "paragraph",
              parts: [
                "Se o uso de dados do Google pelo app mudar, atualizo esta política e a data dela antes de a mudança valer.",
              ],
            },
          ],
        },
        {
          title: "9. Contato",
          blocks: [{ type: "paragraph", parts: ["Dúvidas sobre esta política: ", { email: true }, "."] }],
        },
      ],
    },
  },
};
