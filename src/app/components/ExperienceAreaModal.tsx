import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import modalSvg from "../../imports/ModalOverlay/svg-j25njvl7ht";
import pesquisaDiscovery from "../../imports/slide05-modals/pesquisa-discovery.png";
import interfaceInteracao from "../../imports/slide05-modals/interface-interacao.png";
import designServicos from "../../imports/slide05-modals/design-servicos.png";
import designSystem from "../../imports/slide05-modals/design-system.png";
import acessibilidadeCompliance from "../../imports/slide05-modals/acessibilidade-compliance.png";
import validacaoTestes from "../../imports/slide05-modals/validacao-testes.png";
import { createSlideMetrics } from "../scaling";

interface ExperienceAreaModalProps {
  open: boolean;
  initialIndex: number;
  onClose: () => void;
  scaleX: number;
  scaleY: number;
}

const BLUE = "#036ef2";
const NAVY = "#04165d";
const TOOLTIP_FOLLOW_SPRING = { damping: 28, stiffness: 260, mass: 0.5 };
const TOOLTIP_EASE = [0.25, 1, 0.5, 1] as const;

const AREAS = [
  {
    title: "Pesquisa e Discovery",
    image: pesquisaDiscovery,
    techniques: [
      {
        title: "Entrevistas com utilizadores e stakeholders",
        description:
          "Conversas estruturadas para compreender necessidades, comportamentos, expectativas e restrições de negócio a partir da perspectiva de quem utiliza ou influencia o produto.",
      },
      {
        title: "Personas e jornadas",
        description:
          "As personas sintetizam perfis e padrões de comportamento, enquanto as jornadas representam as etapas, necessidades e dificuldades vividas pelos utilizadores ao longo da experiência.",
      },
      {
        title: "Benchmarks e análise de contexto",
        description:
          "Compara soluções de referência e investiga o contexto real de utilização para identificar padrões, limitações, oportunidades e práticas relevantes para o produto.",
      },
    ],
  },
  {
    title: "Design de Interface e Interação",
    image: interfaceInteracao,
    techniques: [
      {
        title: "Wireframes, fluxos e protótipos",
        description:
          "Representações da estrutura, sequência de tarefas e comportamentos da interface, utilizadas para testar ideias e decisões antes do desenvolvimento visual definitivo.",
      },
      {
        title: "Design de alta fidelidade",
        description:
          "Versão detalhada da interface, próxima do resultado final, com tipografia, cores, componentes, conteúdos, estados e comportamentos de interacção.",
      },
      {
        title: "Especificação técnica para DEV",
        description:
          "Documentação de medidas, estados, comportamentos, conteúdos e regras necessárias para que a equipa de desenvolvimento implemente a solução com fidelidade.",
      },
    ],
  },
  {
    title: "Design de Serviços",
    image: designServicos,
    techniques: [
      {
        title: "Mapeamento de processos",
        description:
          "Representação das actividades, decisões, actores e dependências de um processo, permitindo identificar falhas, redundâncias, bloqueios e oportunidades de melhoria.",
      },
      {
        title: "Service blueprints",
        description:
          "Mapeia a experiência do utilizador e relaciona-a com processos internos, pessoas, sistemas e operações que tornam cada etapa do serviço possível.",
      },
      {
        title: "Desenho de jornadas operacionais",
        description:
          "Representa as etapas realizadas pelas equipas durante a prestação do serviço, evidenciando responsabilidades, interacções, dependências e pontos críticos da operação.",
      },
    ],
  },
  {
    title: "Design System",
    image: designSystem,
    techniques: [
      {
        title: "Tokens, componentes e padrões",
        description:
          "Tokens registam decisões visuais fundamentais, componentes oferecem elementos reutilizáveis e padrões orientam soluções consistentes para problemas recorrentes de interface e interacção.",
      },
      {
        title: "Documentação e governança",
        description:
          "Define orientações de utilização, responsabilidades e processos de contribuição para manter o Design System consistente, actualizado e sustentável ao longo do tempo.",
      },
      {
        title: "Integração com desenvolvimento",
        description:
          "Aproxima design e código através de componentes, especificações e fluxos partilhados, reduzindo divergências entre o que foi desenhado e o que é implementado.",
      },
    ],
  },
  {
    title: "Acessibilidade e Compliance",
    image: acessibilidadeCompliance,
    techniques: [
      {
        title: "Auditoria WCAG",
        description:
          "Avaliação da interface com base nas directrizes WCAG para identificar barreiras relacionadas com percepção, navegação, compreensão, interacção e compatibilidade com tecnologias assistivas.",
      },
      {
        title: "Documentação de boas práticas",
        description:
          "Reúne orientações, exemplos e critérios que ajudam as equipas a tomar decisões mais acessíveis durante o desenho, desenvolvimento e evolução do produto.",
      },
      {
        title: "Testes com utilizadores diversos",
        description:
          "Valida a experiência com pessoas de diferentes capacidades, contextos e formas de interacção para identificar barreiras que avaliações técnicas podem não revelar.",
      },
    ],
  },
  {
    title: "Validação e Testes",
    image: validacaoTestes,
    techniques: [
      {
        title: "Testes de usabilidade",
        description:
          "Observação de utilizadores representativos ao realizar tarefas para identificar dificuldades, erros, expectativas e oportunidades de melhoria na experiência.",
      },
      {
        title: "Análise de dados qualitativos",
        description:
          "Organiza entrevistas, observações e feedbacks para encontrar padrões, necessidades recorrentes e causas que expliquem o comportamento dos utilizadores.",
      },
      {
        title: "Iteração baseada em evidência",
        description:
          "Utiliza resultados de pesquisa, testes e métricas para priorizar melhorias, ajustar a solução e validar novamente se as alterações resolveram o problema.",
      },
    ],
  },
] as const;

export function ExperienceAreaModal({
  open,
  initialIndex,
  onClose,
  scaleX,
  scaleY,
}: ExperienceAreaModalProps) {
  const { vs, vx } = createSlideMetrics(scaleX, scaleY);
  const [currentPage, setCurrentPage] = useState(initialIndex);
  const [closeHovered, setCloseHovered] = useState(false);
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);
  const [activeTechnique, setActiveTechnique] = useState<number | null>(null);
  const directionRef = useRef(1);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  const tooltipX = useMotionValue(0);
  const tooltipY = useMotionValue(0);
  const tooltipSpringX = useSpring(tooltipX, TOOLTIP_FOLLOW_SPRING);
  const tooltipSpringY = useSpring(tooltipY, TOOLTIP_FOLLOW_SPRING);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    setCurrentPage(initialIndex);
    setActiveTechnique(null);
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        directionRef.current = -1;
        setActiveTechnique(null);
        setCurrentPage((page) => (page - 1 + AREAS.length) % AREAS.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        directionRef.current = 1;
        setActiveTechnique(null);
        setCurrentPage((page) => (page + 1) % AREAS.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, initialIndex]);

  const goTo = (index: number) => {
    directionRef.current = index > currentPage ? 1 : -1;
    setActiveTechnique(null);
    setCurrentPage(index);
  };

  const area = AREAS[currentPage];
  const technique = activeTechnique === null ? null : area.techniques[activeTechnique];
  const positionTooltipForFocus = (index: number) => {
    tooltipX.set(vs([105, 338, 571][index]));
    tooltipY.set(vs(88));
  };
  const followPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const galleryRect = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - galleryRect.left;
    const pointerY = event.clientY - galleryRect.top;
    const edge = vs(12);
    const gap = vs(20);
    const tooltipWidth = vs(460);
    const tooltipHeight = tooltipRef.current?.getBoundingClientRect().height ?? vs(234);

    let nextX = pointerX + gap;
    if (nextX + tooltipWidth > galleryRect.width - edge) {
      nextX = pointerX - tooltipWidth - gap;
    }

    nextX = Math.max(edge, Math.min(nextX, galleryRect.width - tooltipWidth - edge));
    const nextY = Math.max(
      edge,
      Math.min(pointerY - tooltipHeight / 2, galleryRect.height - tooltipHeight - edge),
    );

    tooltipX.set(nextX);
    tooltipY.set(nextY);
  };
  const slideVariants = {
    enter: (direction: number) => ({ x: direction * vx(40), opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.28, ease: "easeOut" as const },
    },
    exit: (direction: number) => ({
      x: direction * -vx(40),
      opacity: 0,
      transition: { duration: 0.18, ease: "easeIn" as const },
    }),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="experience-area-overlay"
          data-experience-modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={(event) => event.stopPropagation()}
          onMouseUp={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            if (event.target === event.currentTarget) onClose();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(4, 22, 93, 0.80)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="experience-area-modal-title"
            initial={{ scale: 0.96, opacity: 0, y: vs(18) }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: vs(18) }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              position: "relative",
              width: vs(1264),
              height: vs(808),
              padding: vs(64),
              borderRadius: vs(48),
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              color: NAVY,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Fechar detalhes das frentes do Núcleo de Experiência"
              onClick={onClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                position: "absolute",
                top: vs(24),
                right: vs(24),
                width: vs(40),
                height: vs(40),
                border: "none",
                borderRadius: "999px",
                padding: 0,
                backgroundColor: closeHovered ? NAVY : "#2f3237",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.15s ease, transform 0.15s ease",
                zIndex: 2,
              }}
            >
              <svg width={vs(32)} height={vs(32)} viewBox="0 0 32 32" fill="none" aria-hidden>
                <path d={modalSvg.peeed100} fill="currentColor" />
              </svg>
            </button>

            <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
              <AnimatePresence mode="wait" custom={directionRef.current}>
                <motion.div
                  key={currentPage}
                  custom={directionRef.current}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: vs(32),
                    height: "100%",
                  }}
                >
                  <h2
                    id="experience-area-modal-title"
                    style={{
                      margin: 0,
                      fontFamily: "'Bronkoh-Heavy', sans-serif",
                      fontSize: vs(40),
                      lineHeight: 1.2,
                      letterSpacing: vs(-0.5),
                      color: NAVY,
                    }}
                  >
                    {area.title}
                  </h2>

                  <div
                    onPointerMove={followPointer}
                    onPointerLeave={() => setActiveTechnique(null)}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: vs(525),
                      borderRadius: vs(24),
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={area.image}
                      alt=""
                      aria-hidden="true"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                    />

                    <div
                      aria-label={`Técnicas de ${area.title}`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 2,
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        columnGap: vs(16),
                      }}
                    >
                      {area.techniques.map((item, index) => {
                        const tooltipId = `experience-technique-tooltip-${currentPage}-${index}`;
                        const isActive = activeTechnique === index;

                        return (
                          <div
                            key={item.title}
                            data-technique-hotspot={item.title}
                            role="img"
                            tabIndex={0}
                            aria-label={`${item.title}. ${item.description}`}
                            aria-describedby={isActive ? tooltipId : undefined}
                            onPointerEnter={() => setActiveTechnique(index)}
                            onFocus={() => {
                              positionTooltipForFocus(index);
                              setActiveTechnique(index);
                            }}
                            onBlur={() =>
                              setActiveTechnique((active) => (active === index ? null : active))
                            }
                            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/90"
                            style={{
                              minWidth: 0,
                              cursor: "help",
                              borderRadius: vs(24),
                            }}
                          />
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {technique && activeTechnique !== null && (
                        <motion.div
                          key={`experience-technique-tooltip-${currentPage}`}
                          initial={{ opacity: 0, scale: 0.985 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.99 }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.2,
                            ease: TOOLTIP_EASE,
                          }}
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            x: prefersReducedMotion ? tooltipX : tooltipSpringX,
                            y: prefersReducedMotion ? tooltipY : tooltipSpringY,
                            zIndex: 3,
                            pointerEvents: "none",
                            willChange: "transform, opacity",
                          }}
                        >
                          <motion.div
                            ref={tooltipRef}
                            layout="size"
                            id={`experience-technique-tooltip-${currentPage}-${activeTechnique}`}
                            role="tooltip"
                            data-technique-tooltip
                            transition={{
                              layout: {
                                duration: prefersReducedMotion ? 0 : 0.24,
                                ease: TOOLTIP_EASE,
                              },
                            }}
                            style={{
                              width: vs(460),
                              boxSizing: "border-box",
                              display: "flex",
                              flexDirection: "column",
                              gap: vs(12),
                              padding: vs(32),
                              borderRadius: vs(28),
                              backgroundColor: "rgba(0, 0, 0, 0.90)",
                              backdropFilter: `blur(${vs(20)}px)`,
                              WebkitBackdropFilter: `blur(${vs(20)}px)`,
                              color: "#ffffff",
                            }}
                          >
                            <AnimatePresence initial={false} mode="popLayout">
                              <motion.div
                                key={technique.title}
                                layout="position"
                                initial={{ opacity: prefersReducedMotion ? 1 : 0.55 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
                                transition={{
                                  duration: prefersReducedMotion ? 0 : 0.14,
                                  ease: TOOLTIP_EASE,
                                }}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: vs(12),
                                }}
                              >
                                <strong
                                  style={{
                                    margin: 0,
                                    fontFamily: "'Bronkoh-Heavy', sans-serif",
                                    fontSize: vs(24),
                                    lineHeight: 1.2,
                                    fontWeight: 400,
                                  }}
                                >
                                  {technique.title}
                                </strong>
                                <p
                                  style={{
                                    margin: 0,
                                    fontFamily: "'Bronkoh-Regular', sans-serif",
                                    fontSize: vs(20),
                                    lineHeight: 1.2,
                                    fontWeight: 400,
                                  }}
                                >
                                  {technique.description}
                                </p>
                              </motion.div>
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vs(24),
                width: "100%",
                flexShrink: 0,
              }}
            >
              <NavigationButton
                label="Frente anterior"
                direction="back"
                hovered={prevHovered}
                onHover={setPrevHovered}
                onClick={() => goTo((currentPage - 1 + AREAS.length) % AREAS.length)}
                vs={vs}
              />

              <div style={{ display: "flex", gap: vs(4), alignItems: "center" }}>
                {AREAS.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Abrir ${item.title}`}
                    aria-current={index === currentPage ? "true" : undefined}
                    onClick={() => goTo(index)}
                    style={{
                      width: vs(24),
                      height: vs(24),
                      border: "none",
                      padding: 0,
                      background: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: vs(16),
                        height: vs(16),
                        borderRadius: "999px",
                        backgroundColor: index === currentPage ? BLUE : "#b8cbe0",
                        transition: "background-color 0.15s ease, transform 0.15s ease",
                      }}
                    />
                  </button>
                ))}
              </div>

              <NavigationButton
                label="Próxima frente"
                direction="forward"
                hovered={nextHovered}
                onHover={setNextHovered}
                onClick={() => goTo((currentPage + 1) % AREAS.length)}
                vs={vs}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavigationButton({
  label,
  direction,
  hovered,
  onHover,
  onClick,
  vs,
}: {
  label: string;
  direction: "back" | "forward";
  hovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
  vs: (value: number) => number;
}) {
  const path = direction === "back" ? modalSvg.pc8e8d80 : modalSvg.p11a80500;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        width: vs(40),
        height: vs(40),
        borderRadius: "999px",
        border: "none",
        padding: 0,
        backgroundColor: hovered ? NAVY : BLUE,
        color: "#ffffff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.15s ease, transform 0.15s ease",
      }}
    >
      <svg width={vs(24)} height={vs(24)} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d={path} fill="currentColor" />
      </svg>
    </button>
  );
}
