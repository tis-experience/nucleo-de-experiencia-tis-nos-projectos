import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import modalSvg from "../../imports/ModalOverlay/svg-j25njvl7ht";
import strategyImage from "../../imports/iceberg-estrategia.png";
import scopeImage from "../../imports/iceberg-escopo.png";
import structureImage from "../../imports/iceberg-estrutura.png";
import skeletonImage from "../../imports/iceberg-esqueleto.png";
import surfaceImage from "../../imports/iceberg-superficie.png";
import { createSlideMetrics } from "../scaling";

interface IcebergLayerModalProps {
  open: boolean;
  initialIndex: number;
  onClose: () => void;
  scaleX: number;
  scaleY: number;
}

interface LayerContent {
  title: string;
  image: string;
  body: ReactNode;
}

const BLUE = "#036ef2";
const NAVY = "#04165d";

const LAYERS: LayerContent[] = [
  {
    title: "Estratégia",
    image: strategyImage,
    body: (
      <>
        A camada de <strong>Estratégia</strong> é onde são definidos os <strong>objectivos de negócio</strong>, as <strong>necessidades dos utilizadores</strong> e a <strong>proposta de valor do produto</strong>. Esta camada envolve <strong>pesquisa de mercado, definição de personas, análise competitiva e alinhamento entre as metas do negócio</strong> e as <strong>expectativas do público-alvo</strong>. É o alicerce que garante que cada escolha de design serve um propósito real.
      </>
    ),
  },
  {
    title: "Escopo",
    image: scopeImage,
    body: (
      <>
        A camada de <strong>Escopo</strong> define o que o produto deve fazer e qual conteúdo precisa oferecer. É aqui que as necessidades dos utilizadores e os objectivos de negócio são traduzidos em requisitos funcionais e de conteúdo. <strong>Sem um escopo bem definido, equipas trabalham sem direcção clara, funcionalidades são adicionadas sem critério e o produto cresce de forma desorganizada.</strong> Um bom escopo responde às perguntas: <strong>que problemas vamos resolver? Que funcionalidades são essenciais? Que conteúdo o utilizador espera encontrar?</strong>
      </>
    ),
  },
  {
    title: "Estrutura",
    image: structureImage,
    body: (
      <>
        A <strong>Estrutura</strong> é a camada que define <strong>como o conteúdo e as funcionalidades serão organizados e conectados</strong>, assim como o produto responderá às acções dos utilizadores. Engloba a <strong>arquitectura da informação, o design de interacção e os fluxos de tarefa.</strong> Uma boa estrutura permite que o utilizador compreenda como o produto funciona e encontre o que precisa sem se perder. É aqui que se definem <strong>sitemaps, taxonomias, modelos conceptuais e relações entre funcionalidades e conteúdos.</strong> Quando a estrutura é fraca, mesmo uma interface visualmente atraente gera confusão, abandono e frustração.
      </>
    ),
  },
  {
    title: "Esqueleto",
    image: skeletonImage,
    body: (
      <>
        A camada de <strong>Esqueleto</strong> define <strong>como as decisões da estrutura serão representadas na interface.</strong> Abrange o design de interface, o design de navegação e o design da informação. É aqui que se organizam os <strong>componentes, os controlos, os conteúdos e os elementos de navegação</strong>, normalmente representados em <strong>wireframes</strong>. Sem essa base bem definida, mesmo interfaces visualmente atraentes falham em usabilidade. É nesta camada que se <strong>decide o que aparece, onde aparece e que referências ajudam o utilizador a orientar-se pelo produto.</strong>
      </>
    ),
  },
  {
    title: "Superfície",
    image: surfaceImage,
    body: (
      <>
        A superfície do iceberg <strong>representa o que os utilizadores vêem e com que interagem directamente, é a interface visual.</strong> Inclui elementos como <strong>cores, tipografia, ícones, imagens, botões e layout.</strong> Embora seja a camada mais visível, é apenas uma fracção da experiência completa. Um design visualmente atractivo pode causar uma boa primeira impressão, mas sem as camadas mais profundas (como estratégia, escopo e estrutura), a experiência será superficial e pouco funcional.
      </>
    ),
  },
];

export function IcebergLayerModal({
  open,
  initialIndex,
  onClose,
  scaleX,
  scaleY,
}: IcebergLayerModalProps) {
  const { vs, vx } = createSlideMetrics(scaleX, scaleY);
  const [currentPage, setCurrentPage] = useState(initialIndex);
  const [closeHovered, setCloseHovered] = useState(false);
  const [prevHovered, setPrevHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);
  const directionRef = useRef(1);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    setCurrentPage(initialIndex);
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        directionRef.current = -1;
        setCurrentPage((page) => (page - 1 + LAYERS.length) % LAYERS.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        directionRef.current = 1;
        setCurrentPage((page) => (page + 1) % LAYERS.length);
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
    setCurrentPage(index);
  };

  const layer = LAYERS[currentPage];
  const slideVariants = {
    enter: (direction: number) => ({ x: direction * vx(40), opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: "easeOut" as const } },
    exit: (direction: number) => ({ x: direction * -vx(40), opacity: 0, transition: { duration: 0.18, ease: "easeIn" as const } }),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="iceberg-layer-overlay"
          data-iceberg-modal
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
            zIndex: 100,
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
            aria-labelledby="iceberg-layer-modal-title"
            initial={{ scale: 0.96, opacity: 0, y: vs(18) }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: vs(18) }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              position: "relative",
              width: vs(1080),
              height: vs(840),
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
              aria-label="Fechar detalhes das camadas"
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
                    gap: vs(24),
                    height: "100%",
                  }}
                >
                  <h2
                    id="iceberg-layer-modal-title"
                    style={{
                      margin: 0,
                      fontFamily: "'Bronkoh-Heavy', sans-serif",
                      fontSize: vs(40),
                      lineHeight: 1.2,
                      letterSpacing: vs(-0.5),
                      color: NAVY,
                    }}
                  >
                    {layer.title}
                  </h2>

                  <img
                    src={layer.image}
                    alt=""
                    aria-hidden="true"
                    style={{
                      display: "block",
                      width: "100%",
                      height: vs(360),
                      borderRadius: vs(24),
                      objectFit: "cover",
                      objectPosition: "center",
                      flexShrink: 0,
                    }}
                  />

                  <p
                    style={{
                      margin: 0,
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: vs(20),
                      lineHeight: 1.4,
                      letterSpacing: vs(-0.1),
                      color: "#2f3237",
                    }}
                  >
                    {layer.body}
                  </p>
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
                label="Camada anterior"
                direction="back"
                hovered={prevHovered}
                onHover={setPrevHovered}
                onClick={() => goTo((currentPage - 1 + LAYERS.length) % LAYERS.length)}
                vs={vs}
              />

              <div style={{ display: "flex", gap: vs(4), alignItems: "center" }}>
                {LAYERS.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Abrir camada ${item.title}`}
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
                        width: vs(index === currentPage ? 16 : 14),
                        height: vs(index === currentPage ? 16 : 14),
                        borderRadius: "999px",
                        backgroundColor: index === currentPage ? BLUE : "#b8cbe0",
                        transition: "background-color 0.15s ease, transform 0.15s ease",
                      }}
                    />
                  </button>
                ))}
              </div>

              <NavigationButton
                label="Próxima camada"
                direction="forward"
                hovered={nextHovered}
                onHover={setNextHovered}
                onClick={() => goTo((currentPage + 1) % LAYERS.length)}
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
        width: vs(48),
        height: vs(48),
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
