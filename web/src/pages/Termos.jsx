import LegalShell, { H2, P, UL } from "../components/LegalShell.jsx";

export default function Termos() {
  return (
    <LegalShell titulo="Termos de Uso" atualizado="18/10/2026">
      <P>
        Bem-vindo(a) ao CuidaPet. Ao criar uma conta e utilizar o aplicativo, você concorda com estes
        Termos de Uso. Leia com atenção. Se não concordar, por favor não utilize o serviço.
      </P>

      <H2>1. O que é o CuidaPet</H2>
      <P>
        O CuidaPet é uma ferramenta para ajudar tutores a organizar os cuidados de seus animais de estimação —
        como carteira de saúde, vacinas, medicamentos, banho e tosa, despesas e lembretes. O CuidaPet
        <strong> não substitui a orientação de um médico-veterinário</strong> e não presta serviços veterinários.
      </P>

      <H2>2. Cadastro e conta</H2>
      <UL>
        <li>Você é responsável por manter a confidencialidade da sua senha e por toda atividade na sua conta.</li>
        <li>As informações fornecidas no cadastro devem ser verdadeiras e atualizadas.</li>
        <li>O serviço destina-se a maiores de 18 anos ou a menores devidamente autorizados por seus responsáveis.</li>
      </UL>

      <H2>3. Conteúdo que você cadastra</H2>
      <P>
        Os dados e fotos que você adiciona (dos seus pets e dos cuidados) são de sua responsabilidade. Você declara
        ter o direito de usá-los e nos autoriza a armazená-los e exibi-los dentro do aplicativo para prestar o serviço,
        inclusive para tutores com quem você optar por compartilhar um pet.
      </P>

      <H2>4. Uso aceitável</H2>
      <P>Você concorda em não utilizar o CuidaPet para fins ilícitos, para violar direitos de terceiros,
        enviar conteúdo ofensivo ou tentar comprometer a segurança do serviço.</P>

      <H2>5. Disponibilidade e isenção de garantias</H2>
      <P>
        O serviço é fornecido "no estado em que se encontra". Buscamos manter o CuidaPet disponível e correto, mas
        não garantimos funcionamento ininterrupto ou livre de erros. Lembretes e informações são um apoio à organização
        e não devem ser a única fonte para decisões sobre a saúde do seu pet.
      </P>

      <H2>6. Limitação de responsabilidade</H2>
      <P>
        Na extensão permitida pela lei, o CuidaPet não se responsabiliza por danos decorrentes do uso ou da
        impossibilidade de uso do serviço, incluindo perda de dados ou decisões tomadas com base nas informações registradas.
      </P>

      <H2>7. Encerramento da conta</H2>
      <P>
        Você pode excluir sua conta a qualquer momento pelo próprio aplicativo, em "Meu Perfil". A exclusão remove seus
        dados conforme descrito na Política de Privacidade.
      </P>

      <H2>8. Alterações nestes Termos</H2>
      <P>Podemos atualizar estes Termos periodicamente. Mudanças relevantes serão informadas no aplicativo. O uso
        contínuo após a atualização representa concordância com a nova versão.</P>

      <H2>9. Contato</H2>
      <P>Dúvidas sobre estes Termos? Fale com a gente pelos canais de contato disponibilizados no aplicativo.</P>
    </LegalShell>
  );
}
