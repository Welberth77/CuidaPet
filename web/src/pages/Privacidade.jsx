import LegalShell, { H2, P, UL } from "../components/LegalShell.jsx";

export default function Privacidade() {
  return (
    <LegalShell titulo="Política de Privacidade" atualizado="18/10/2026">
      <P>
        Sua privacidade é importante para nós. Esta política explica quais dados o CuidaPet coleta, como são usados e
        quais são os seus direitos, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
      </P>

      <H2>1. Dados que coletamos</H2>
      <UL>
        <li><strong>Dados de cadastro:</strong> nome e e-mail.</li>
        <li><strong>Dados dos pets:</strong> nome, espécie, raça, sexo, peso, data de nascimento, foto e observações.</li>
        <li><strong>Registros de cuidados:</strong> vacinas, medicamentos, banho e tosa, despesas e datas associadas.</li>
        <li><strong>Dados técnicos:</strong> informações necessárias para manter sua sessão de login funcionando.</li>
      </UL>

      <H2>2. Como usamos seus dados</H2>
      <UL>
        <li>Prestar e manter o serviço (organizar os cuidados e exibir suas informações).</li>
        <li>Enviar e-mails essenciais da conta (confirmação de cadastro e recuperação de senha) e, quando habilitado, lembretes de cuidados.</li>
        <li>Melhorar e dar suporte ao aplicativo.</li>
      </UL>

      <H2>3. Base legal</H2>
      <P>Tratamos seus dados principalmente para a execução do contrato (prestação do serviço que você solicitou) e,
        quando aplicável, com base no seu consentimento.</P>

      <H2>4. Compartilhamento</H2>
      <P>
        <strong>Não vendemos seus dados.</strong> Compartilhamos informações apenas com fornecedores que viabilizam o
        serviço, como a infraestrutura de banco de dados e autenticação (Supabase) e o provedor de envio de e-mails.
        Também compartilhamos os dados de um pet com outro tutor somente quando <em>você</em> escolhe compartilhá-lo.
      </P>

      <H2>5. Armazenamento e segurança</H2>
      <P>
        Seus dados são armazenados em servidores do nosso provedor de infraestrutura, com conexão criptografada e
        regras de acesso que garantem que cada usuário veja apenas os próprios dados (e os que lhe foram compartilhados).
      </P>

      <H2>6. Seus direitos (LGPD)</H2>
      <UL>
        <li>Acessar e corrigir seus dados (pelo próprio aplicativo, em "Meu Perfil").</li>
        <li>Excluir sua conta e seus dados a qualquer momento, em "Meu Perfil".</li>
        <li>Solicitar informações sobre o tratamento dos seus dados pelos nossos canais de contato.</li>
      </UL>

      <H2>7. Retenção</H2>
      <P>Mantemos seus dados enquanto sua conta estiver ativa. Ao excluir a conta, seus dados são removidos, salvo
        obrigações legais de retenção.</P>

      <H2>8. Menores de idade</H2>
      <P>O serviço não é direcionado à coleta de dados de menores sem o consentimento dos responsáveis.</P>

      <H2>9. Alterações nesta Política</H2>
      <P>Podemos atualizar esta Política periodicamente. Mudanças relevantes serão comunicadas no aplicativo.</P>

      <H2>10. Contato</H2>
      <P>Para exercer seus direitos ou tirar dúvidas, fale com a gente pelos canais de contato disponibilizados no aplicativo.</P>
    </LegalShell>
  );
}
