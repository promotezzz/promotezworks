import { useState, useEffect } from 'react';
// promotezworks official landing page app
import Aurora from './Aurora';
import CardNav from './CardNav';
import TextType from './TextType';
import ReflectiveCard from './ReflectiveCard';
import Counter from './Counter';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import FlowingMenu from './FlowingMenu';
import PointerHighlightDemo from './components/pointer-highlight-demo';
import logo from './logo.svg';
import './App.css';

export default function App() {
  const [downloads, setDownloads] = useState(0);

  const menuItems = [
    { link: 'https://modrinth.com/modpack/yours-optimized', text: 'Yours Optimized', image: '/yours_optimized_logo.png' },
    { link: 'https://modrinth.com/organization/promotezworks', text: 'Coming Soon', image: 'https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=600&q=80' },
    { link: 'https://modrinth.com/organization/promotezworks', text: 'Coming Soon', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&q=80' }
  ];

  useEffect(() => {
    let active = true;
    const fallbackDownloads = 0; // Page is under review, actual starting count is 0

    fetch('https://api.modrinth.com/v2/user/promotezworks/projects')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((acc, proj) => acc + (proj.downloads || 0), 0);
          // If the organization is active and has downloads, use it; otherwise fallback
          setDownloads(total > 0 ? total : fallbackDownloads);
        } else {
          setDownloads(fallbackDownloads);
        }
      })
      .catch(() => {
        if (!active) return;
        setDownloads(fallbackDownloads);
      });

    return () => {
      active = false;
    };
  }, []);

  const items = [
    {
      label: 'Modpacks',
      bgColor: '#141f14',
      textColor: '#fff',
      links: [
        { label: 'Featured Packs', ariaLabel: 'Featured Modpacks',    href: '#' },
        { label: 'Changelog',      ariaLabel: 'Modpack Changelog',     href: '#' },
      ],
    },
    {
      label: 'Mods',
      bgColor: '#111a1f',
      textColor: '#fff',
      links: [
        { label: 'Browse Mods',  ariaLabel: 'Browse all Mods',        href: 'https://modrinth.com/organization/promotezworks' },
        { label: 'Source Code',  ariaLabel: 'Source Code on GitHub',   href: '#' },
      ],
    },
    {
      label: 'Community',
      bgColor: '#1a1427',
      textColor: '#fff',
      links: [
        { label: 'Discord',  ariaLabel: 'Join our Discord',            href: '#' },
        { label: 'About Us', ariaLabel: 'About promotezworks',          href: '#' },
      ],
    },
  ];

  const cards = [
    {
      badge: 'POSITION OPEN',
      title: '— — —',
      subtitle: 'WAITING TO BE FILLED',
      overlayColor: 'rgba(15, 25, 15, 0.4)',
    },
    {
      badge: 'OWNER',
      title: 'PROMOTEZ',
      subtitle: 'FOUNDER & OWNER',
      overlayColor: 'rgba(10, 20, 30, 0.35)',
      imageUrl: '/promotez.png',
    },
    {
      badge: 'POSITION OPEN',
      title: '— — —',
      subtitle: 'WAITING TO BE FILLED',
      overlayColor: 'rgba(15, 25, 15, 0.4)',
    },
  ];

  return (
    /* Make the whole page scrollable */
    <div style={{ width: '100vw', backgroundColor: '#060b06', overflowX: 'hidden' }}>

      {/* ── HERO PAGE (100vh) ─────────────────────────────────── */}
      <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>

        {/* Aurora Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Aurora
            colorStops={['#7cff67', '#B497CF', '#5227FF']}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        {/* Top Navigation Bar */}
        <CardNav
          logo={logo}
          logoAlt="promotezworks"
          items={items}
          baseColor="#fff"
          menuColor="#000"
          buttonBgColor="#14532d"
          buttonTextColor="#fff"
          buttonText="Download Yours"
          buttonHref="https://modrinth.com/modpack/yours-optimized"
          ease="power3.out"
        />

        {/* Hero Typing Title */}
        <section className="hero-section" aria-label="Hero">
          <div className="hero-inner">
            <h1 className="hero-title">
              <TextType
                text={[
                  'Optimized modpacks, server-ready',
                  'Maximum performance & compatibility',
                  'Pre-configured for zero lag',
                  'Highest FPS possible',
                  'Performance driven',
                ]}
                typingSpeed={55}
                deletingSpeed={28}
                pauseDuration={2200}
                showCursor={true}
                cursorCharacter="|"
                cursorClassName="hero-cursor"
              />
            </h1>
          </div>
        </section>

      </div>

      {/* ── COLLABORATION CALLOUT ─────────────────────────────── */}
      <section className="collab-callout-section" aria-label="Collaboration Callout">
        <PointerHighlightDemo />
      </section>

      {/* ── STATS SECTION (DYNAMIC DOWNLOADS COUNTER) ────────── */}
      <section className="stats-section" aria-label="Statistics">
        <div className="stats-container-inner">
          <h2 className="stats-title">Total Project Downloads</h2>
          <div className="stats-counter-wrapper">
            <Counter
              value={downloads}
              fontSize={80}
              gap={4}
              textColor="#4ade80"
              fontWeight={900}
              gradientFrom="#060b06"
              gradientTo="transparent"
              gradientHeight={20}
              borderRadius={8}
              horizontalPadding={12}
            />
          </div>
          <p className="stats-subtitle">
            Across all promotezworks modpacks & mods published on Modrinth
          </p>
        </div>
      </section>

      {/* ── PROJECTS SECTION (SCROLL STACK) ────────────────────── */}
      <section className="projects-stack-section" aria-label="What We Do">
        <h2 className="projects-section-title">What We Do</h2>
        <ScrollStack useWindowScroll={true} itemDistance={100} itemStackDistance={30} stackPosition="20%" baseScale={0.85}>
          <ScrollStackItem itemClassName="card-tech">
            <span className="stack-badge tech">OPTIMIZATION</span>
            <h2>Performance &amp; FPS Tuning</h2>
            <p>We build and configure modpacks with custom JVM settings, memory optimization patches, and render fixes to deliver the highest possible frame rates.</p>
          </ScrollStackItem>
          <ScrollStackItem itemClassName="card-curation">
            <span className="stack-badge curation">MULTIPLAYER</span>
            <h2>Server-Ready Out of the Box</h2>
            <p>Our modpacks feature only client-side mods. This allows you to join any multiplayer server immediately without needing server-side installs or risking bans.</p>
          </ScrollStackItem>
          <ScrollStackItem itemClassName="card-community">
            <span className="stack-badge community">COMPATIBILITY</span>
            <h2>Rigorous Conflict Resolution</h2>
            <p>We test hundreds of mod interactions, adjusting custom configs to eliminate ID conflicts, registry issues, server-side ticks, and micro-stutters.</p>
          </ScrollStackItem>
        </ScrollStack>
      </section>

      {/* ── MODPACK DIRECTORY SECTION (FLOWING MENU) ──────────── */}
      <section className="directory-menu-section" aria-label="Modpack Directory">
        <h2 className="directory-menu-title">Explore Our Modpacks</h2>
        <div style={{ height: '350px', width: '100%', position: 'relative' }}>
          <FlowingMenu
            items={menuItems}
            textColor="#ffffff"
            bgColor="#060b06"
            marqueeBgColor="#4ade80"
            marqueeTextColor="#060b06"
            borderColor="rgba(255, 255, 255, 0.05)"
          />
        </div>
      </section>

      {/* ── CARDS SECTION (TEAM) ────────────────────────────────── */}
      <section className="cards-section" aria-label="About promotezworks">
        <h2 className="team-section-title">Development Team</h2>
        <div className="cards-row">
          {cards.map((card, i) => (
            <ReflectiveCard
              key={i}
              badge={card.badge}
              title={card.title}
              subtitle={card.subtitle}
              overlayColor={card.overlayColor}
              imageUrl={card.imageUrl}
              blurStrength={10}
              glassDistortion={15}
              metalness={0.8}
              roughness={0.5}
              displacementStrength={25}
              noiseScale={1.5}
              specularConstant={2.0}
              grayscale={0.5}
            />
          ))}
        </div>
      </section>

      {/* ── FOOTER SECTION (LEGAL & COPYRIGHT) ─────────────────── */}
      <footer className="footer-section">
        <div className="footer-content">
          <img src={logo} alt="promotezworks" className="footer-logo" />
          <p className="footer-text">
            &copy; {new Date().getFullYear()} promotezworks. All rights reserved.
          </p>
          <p className="footer-disclaimer">
            Not an official Minecraft product. We are not approved by, associated with, or affiliated with Mojang Studios, Microsoft, or any of their respective entities. All Minecraft brand assets, names, and trademarks belong to their respective owners.
          </p>
          <div className="footer-links">
            <a href="/tos.html" className="footer-link">Terms of Service</a>
            <a href="/privacy.html" className="footer-link">Privacy Policy</a>
            <a href="https://modrinth.com/organization/promotezworks" target="_blank" rel="noopener noreferrer" className="footer-link">Modrinth Page</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
