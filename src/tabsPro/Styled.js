import styled from "styled-components";

const Shell = styled.div`
    width: 100%;
    padding: clamp(28px, 6vw, 72px) 20px;
`;

const Panel = styled.div`
    width: min(980px, 100%);
    margin: 0 auto;
    background: linear-gradient(180deg, rgba(18, 22, 31, 0.98), rgba(10, 13, 19, 0.98));
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: clamp(18px, 4vw, 32px);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
`;

const Title = styled.h1`
    margin: 0 0 8px;
    font-size: clamp(1.8rem, 4vw, 2.75rem);
    letter-spacing: -0.04em;
`;

const Sub = styled.p`
    color: var(--muted);
    max-width: 680px;
    line-height: 1.7;
    margin: 0 0 24px;
`;

const Row = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
`;

export const Styled = { Shell, Panel, Title, Sub, Row };