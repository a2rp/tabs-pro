import styled from "styled-components";

const Shell = styled.div`
    min-height: 100dvh;
    display: grid;
    place-items: center;
    padding: 28px;
`;

const Panel = styled.div`
    width: min(980px, 96vw);
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.02),
        rgba(255, 255, 255, 0.005)
    );
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
`;

const Title = styled.h1`
    margin: 6px 0 2px;
`;
const Sub = styled.p`
    color: var(--muted);
    margin: 0 0 16px;
`;
const Row = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
`;

export const Styled = { Shell, Panel, Title, Sub, Row };
