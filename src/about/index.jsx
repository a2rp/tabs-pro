import { Styled } from "./styled";

const About = () => <Styled.Wrapper>
    <Styled.Main>
        <h1>About Tabs Pro</h1>
        <p>Tabs Pro is a compact React component for building clear, keyboard-friendly tab interfaces with persistent notes.</p>
        <p>The project demonstrates accessible tab roles, keyboard navigation, closable tabs, local storage persistence and a responsive visual system.</p>
        <h3>What it includes</h3>
        <ul>
            <li>Keyboard navigation with arrow keys, Home and End</li>
            <li>Closable tabs and addable note tabs</li>
            <li>Local storage persistence with a reset action</li>
        </ul>
        <h3>Future possibilities</h3>
        <p>The component can be extended with drag and drop ordering, lazy tab panels, route-aware tabs and custom tab content.</p>
    </Styled.Main>
</Styled.Wrapper>;

export default About;
