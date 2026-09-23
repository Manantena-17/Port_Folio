// src/componements/ProjectCard.jsx — Version styled-components
import React, { useState, useMemo, useCallback, memo } from 'react';
import styled, { css, keyframes } from 'styled-components';

/* ============================================================
   Animations
   ============================================================ */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ============================================================
   Styled Components
   ============================================================ */
const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
  border-radius: 14px;
  background: ${({ theme }) => theme.cardBg};
  box-shadow: 0 4px 16px ${({ theme }) => theme.shadow};
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  animation: ${fadeInUp} 0.4s ease both;

  &:hover,
  &:focus-visible {
    transform: translateY(-6px);
    box-shadow: 0 16px 42px ${({ theme }) => theme.shadowHover};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 3px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  padding: 0.35rem 0.85rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #3b2f00;
  border-radius: 999px;
  background: linear-gradient(135deg, #f9e076 0%, #f1c40f 100%);
  box-shadow: 0 4px 10px rgba(241, 196, 15, 0.4);
`;

const Media = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 480px) {
    height: 170px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;

  ${Card}:hover & {
    transform: scale(1.07);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    ${Card}:hover & { transform: none; }
  }
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 3.5rem;
  color: #fff;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2));
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  gap: 0.75rem;

  @media (max-width: 480px) {
    padding: 1.15rem;
  }
`;

const Category = styled.span`
  align-self: flex-start;
  padding: 0.25rem 0.85rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.categoryText};
  background: ${({ theme }) => theme.categoryBg};
  border-radius: 999px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: ${({ theme }) => theme.textPrimary};

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const Description = styled.p`
  flex: 1;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.textSecondary};
`;

const TechList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Tech = styled.li`
  padding: 0.25rem 0.7rem;
  font-size: 0.72rem;
  font-weight: 500;
  color: ${({ theme }) => theme.techText};
  background: ${({ theme }) => theme.techBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.techHoverBg};
    color: ${({ theme }) => theme.techHoverText};
  }
`;

const TechMore = styled.li`
  padding: 0.25rem 0.7rem;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.techBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin-top: auto;
`;

const LinkBase = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.25s, border-color 0.25s;
`;

const PrimaryLink = styled(LinkBase)`
  color: ${({ theme }) => theme.textPrimary};
  border-bottom: 2px solid ${({ theme }) => theme.accent};
  padding-bottom: 2px;

  &:hover {
    color: ${({ theme }) => theme.accentDark};
    border-color: ${({ theme }) => theme.accentDark};
  }
`;

const SecondaryLink = styled(LinkBase)`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textSecondary};

  &:hover {
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.85rem;
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DateText = styled.time`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.3rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s, filter 0.2s, background 0.2s;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.96);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
  }

  ${({ $variant }) =>
    $variant === 'edit' &&
    css`
      color: ${({ theme }) => theme.editText};
      background: ${({ theme }) => theme.editBg};
      &:hover { background: ${({ theme }) => theme.editHoverBg}; }
    `}

  ${({ $variant }) =>
    $variant === 'delete' &&
    css`
      color: ${({ theme }) => theme.deleteText};
      background: ${({ theme }) => theme.deleteBg};
      &:hover { background: ${({ theme }) => theme.deleteHoverBg}; }
    `}
`;

/* ============================================================
   Composant
   ============================================================ */
function ProjectCard({
  id,
  title = 'Projet sans titre',
  description = '',
  image,
  image_url,
  technologies,
  link,
  githubLink,
  github_link,
  demoLink,
  demo_link,
  category,
  createdAt,
  date,
  featured = false,
  onDelete,
  onEdit,
}) {
  const [imageError, setImageError] = useState(false);

  const normalized = useMemo(() => {
    const imageUrl = image || image_url || null;
    const githubUrl = githubLink || github_link || null;
    const demoUrl = demoLink || demo_link || link || null;
    const projectDate = createdAt || date || null;

    let techArray = technologies;
    if (typeof technologies === 'string') {
      try {
        const parsed = JSON.parse(technologies);
        techArray = Array.isArray(parsed) ? parsed : [technologies];
      } catch {
        techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }
    if (!Array.isArray(techArray)) techArray = [];

    const formattedDate = projectDate
      ? new Date(projectDate).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null;

    return { imageUrl, githubUrl, demoUrl, techArray, formattedDate };
  }, [
    image, image_url,
    githubLink, github_link,
    demoLink, demo_link, link,
    createdAt, date,
    technologies,
  ]);

  const { imageUrl, githubUrl, demoUrl, techArray, formattedDate } = normalized;

  const handleEdit = useCallback(
    (e) => { e.stopPropagation(); e.preventDefault(); onEdit?.(id); },
    [onEdit, id]
  );

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (window.confirm(`Voulez-vous supprimer le projet "${title}" ?`)) {
        onDelete?.(id);
      }
    },
    [onDelete, id, title]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && demoUrl) {
        e.preventDefault();
        window.open(demoUrl, '_blank', 'noopener,noreferrer');
      }
    },
    [demoUrl]
  );

  return (
    <Card
      $clickable={!!demoUrl}
      onClick={() => demoUrl && window.open(demoUrl, '_blank', 'noopener,noreferrer')}
      onKeyDown={handleKeyDown}
      tabIndex={demoUrl ? 0 : -1}
      role={demoUrl ? 'link' : 'article'}
      aria-label={`Projet : ${title}`}
    >
      {featured && <Badge aria-label="Projet mis en avant">⭐ Mis en avant</Badge>}

      <Media>
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={`Aperçu du projet ${title}`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <Placeholder aria-hidden="true">🚀</Placeholder>
        )}
      </Media>

      <Body>
        {category && <Category>{category}</Category>}

        <Title>{title}</Title>

        {description && <Description>{description}</Description>}

        {techArray.length > 0 && (
          <TechList aria-label="Technologies utilisées">
            {techArray.slice(0, 6).map((tech, i) => (
              <Tech key={`${tech}-${i}`}>{tech}</Tech>
            ))}
            {techArray.length > 6 && (
              <TechMore>+{techArray.length - 6}</TechMore>
            )}
          </TechList>
        )}

        <Links>
          {demoUrl && (
            <PrimaryLink
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              🔗 Voir le projet <span aria-hidden="true">→</span>
            </PrimaryLink>
          )}
          {githubUrl && (
            <SecondaryLink
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              📂 Code source
            </SecondaryLink>
          )}
        </Links>

        {(formattedDate || onEdit || onDelete) && (
          <Footer>
            {formattedDate && (
              <DateText dateTime={createdAt || date}>📅 {formattedDate}</DateText>
            )}
            {(onEdit || onDelete) && (
              <Actions>
                {onEdit && (
                  <Button
                    type="button"
                    $variant="edit"
                    onClick={handleEdit}
                    aria-label={`Modifier le projet ${title}`}
                  >
                    ✏️ Modifier
                  </Button>
                )}
                {onDelete && (
                  <Button
                    type="button"
                    $variant="delete"
                    onClick={handleDelete}
                    aria-label={`Supprimer le projet ${title}`}
                  >
                    🗑️ Supprimer
                  </Button>
                )}
              </Actions>
            )}
          </Footer>
        )}
      </Body>
    </Card>
  );
}

export default memo(ProjectCard);