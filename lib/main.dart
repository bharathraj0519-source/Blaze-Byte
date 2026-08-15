import 'dart:ui';
import 'dart:html' as html;

import 'package:flutter/material.dart';

void main() => runApp(const BlazeByteApp());

class BlazeByteApp extends StatelessWidget {
  const BlazeByteApp({super.key});
  @override
  Widget build(BuildContext context) =>
      const MaterialApp(debugShowCheckedModeBanner: false, home: HomePage());
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int openFaq = 0;
  double budget = 4500;
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final messageController = TextEditingController();
  static const purple = Color(0xFF7025ED);
  static const lime = Color(0xFFA8FF18);

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    messageController.dispose();
    super.dispose();
  }

  Future<void> sendOrderEmail() async {
    final name = nameController.text.trim();
    final email = emailController.text.trim();
    final message = messageController.text.trim();
    if (name.isEmpty || email.isEmpty || message.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all order details')),
      );
      return;
    }
    final subject = Uri.encodeComponent('New Blaze Byte Client Order');
    final body = Uri.encodeComponent('''
New Client Order

Client Name: $name
Client Email: $email
Budget: \$${budget.round()}

Project Details:
$message
''');
    // Replace this with the email address where you receive client orders.
    final uri = Uri.parse(
      'mailto:bharathraj0519@gmail.com?subject=$subject&body=$body',
    );
    html.window.location.href = uri.toString();
  }

  @override
  Widget build(BuildContext context) {
    final mobile = MediaQuery.of(context).size.width < 720;
    return Scaffold(
      backgroundColor: const Color(0xFF151515),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF151515), Color(0xFF24143D), Color(0xFF151515)],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              children: [
                _navbar(mobile),
                _hero(mobile),
                _sectionHeading(
                  'Our Services',
                  'We turn your bold ideas into real, measurable results.',
                ),
                _services(mobile),
                _sectionHeading(
                  'Why Choose Blaze Byte Studio ?',
                  'An experienced digital partner built around your goals.',
                ),
                _features(mobile),
                _sectionHeading(
                  'What our Clients say About us',
                  'A few words from teams we have helped transform.',
                ),
                _testimonials(mobile),
                _sectionHeading(
                  'Frequently Asked Questions',
                  'Still have questions? We are happy to help.',
                ),
                _faqs(mobile),
                _contact(mobile),
                footer(mobile),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _navbar(bool mobile) => GlassPanel(
    radius: 0,
    padding: const EdgeInsets.symmetric(horizontal: 24),
    child: SizedBox(
      height: 76,
      child: Row(
        children: [
          _logo(),
          const Spacer(),
          if (!mobile)
            ...['Home', 'Services', 'Why', 'Process', 'About', 'Contact'].map(
              (x) => Padding(
                padding: const EdgeInsets.symmetric(horizontal: 11),
                child: Text(
                  x,
                  style: const TextStyle(
                    color: Color(0xFFD7D7D7),
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          const SizedBox(width: 14),
          FilledButton(
            onPressed: () {},
            style: _primaryStyle(),
            child: const Text('Contact Us'),
          ),
        ],
      ),
    ),
  );

  Widget _logo() => const Row(
    children: [
      _Mark(),
      SizedBox(width: 10),
      Text(
        'Blaze Byte Studio',
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w700,
          fontSize: 17,
        ),
      ),
    ],
  );

  Widget _hero(bool mobile) => SizedBox(
    height: mobile ? 570 : 710,
    child: Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'A Digital Product Studio\nthat will Work',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: mobile ? 38 : 58,
                height: 1.05,
                fontWeight: FontWeight.w600,
                letterSpacing: -1.5,
              ),
            ),
            const SizedBox(height: 28),
            Wrap(
              alignment: WrapAlignment.center,
              spacing: 10,
              runSpacing: 10,
              children: const [
                ChipGlass('Web Design'),
                ChipGlass('SEO Service'),
                ChipGlass('Mobile Applications'),
                ChipGlass('Social Good'),
              ],
            ),
            const SizedBox(height: 36),
            const Text(
              'Turn your vision into reality',
              style: TextStyle(color: Color(0xFFC9C9C9), fontSize: 12),
            ),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: () {},
              style: _primaryStyle(),
              child: const Text('Explore Us'),
            ),
          ],
        ),
      ),
    ),
  );

  Widget _sectionHeading(String title, String subtitle) => Container(
    width: double.infinity,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 82),
    decoration: BoxDecoration(
      color: Colors.black.withValues(alpha: .25),
      border: Border.all(color: Colors.white.withValues(alpha: .08)),
    ),
    child: Column(
      children: [
        Text(
          title,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 32,
            fontWeight: FontWeight.bold,
            letterSpacing: -1,
          ),
        ),
        const SizedBox(height: 13),
        Text(
          subtitle,
          textAlign: TextAlign.center,
          style: const TextStyle(color: Color(0xFFC9C9C9), fontSize: 13),
        ),
      ],
    ),
  );

  Widget _services(bool mobile) {
    const cards = [
      _Info(
        Icons.web,
        'WEB Design',
        'We design clean, functional and engaging websites that make your brand memorable.',
      ),
      _Info(
        Icons.trending_up,
        'SEO Service',
        'Drive meaningful visibility with practical SEO that attracts the right audience.',
      ),
      _Info(
        Icons.folder_copy_outlined,
        'Project Management',
        'A clear, focused process that moves confidently from idea to delivery.',
      ),
    ];
    return _responsiveCards(
      mobile,
      cards.map((x) => ServiceCard(info: x)).toList(),
    );
  }

  Widget _features(bool mobile) {
    const cards = [
      _Info(
        Icons.auto_awesome,
        'Expertise',
        'Deep digital knowledge and a practical mindset, applied to every project.',
      ),
      _Info(
        Icons.groups_outlined,
        'Client-Centric Approach',
        'We listen closely and shape the work around how your business actually works.',
      ),
      _Info(
        Icons.insights_outlined,
        'Results-Driven Solutions',
        'Creative and technical solutions that deliver meaningful, measurable impact.',
      ),
      _Info(
        Icons.handshake_outlined,
        'Collaborative Partnership',
        'A responsive partner from discovery through delivery and beyond.',
      ),
    ];
    return _responsiveCards(
      mobile,
      cards.map((x) => FeatureCard(info: x)).toList(),
      columns: 2,
    );
  }

  Widget _testimonials(bool mobile) {
    const items = [
      [
        'Blaze Byte has been instrumental in transforming our online presence.',
        'Their team brought a clear strategy and a polished new website that our customers love.',
        'John Smith',
        'CEO at Crafted Labs',
      ],
      [
        'Working with Blaze Byte was a breeze.',
        'They understood our vision from day one and turned it into a modern high-performing experience.',
        'Sarah Johnson',
        'Founder of Simply Fresh',
      ],
      [
        'A comprehensive booking system for our event business.',
        'The attention to detail created a smooth experience for both our staff and customers.',
        'Mark Thompson',
        'CEO at Eventify',
      ],
      [
        'They automated our workflow without the complexity.',
        'Our team now spends more time on valuable work and less time on repetitive tasks.',
        'Laura Adams',
        'Operations at ProTech',
      ],
    ];
    return _responsiveCards(
      mobile,
      items.map((x) => TestimonialCard(data: x)).toList(),
      columns: 2,
    );
  }

  Widget _responsiveCards(bool mobile, List<Widget> cards, {int columns = 3}) =>
      Padding(
        padding: const EdgeInsets.all(24),
        child: mobile
            ? Column(
                children: cards
                    .map(
                      (x) => Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: x,
                      ),
                    )
                    .toList(),
              )
            : Wrap(
                spacing: 16,
                runSpacing: 16,
                children: cards
                    .map(
                      (x) => SizedBox(
                        width:
                            (MediaQuery.of(context).size.width -
                                48 -
                                (columns - 1) * 16) /
                            columns,
                        child: x,
                      ),
                    )
                    .toList(),
              ),
      );

  Widget _faqs(bool mobile) {
    const questions = [
      [
        'What services does Blaze Byte provide?',
        'We provide web design, SEO, mobile application development and project management, tailored to help your business grow.',
      ],
      [
        'How can you tackle my business?',
        'We begin with your goals, identify high-impact opportunities and create a clear project plan.',
      ],
      [
        'What industries does Blaze Byte work with?',
        'We partner with ambitious teams across a wide range of industries.',
      ],
      [
        'How long does a project take?',
        'Timing depends on scope. We agree realistic milestones before the work begins.',
      ],
      [
        'Do you offer ongoing support?',
        'Yes. We offer ongoing maintenance, optimisation and support after launch.',
      ],
      [
        'Can you join an existing team?',
        'Absolutely. We can work within an established product and design team.',
      ],
      [
        'How involved will I be?',
        'You remain involved throughout with regular check-ins and feedback moments.',
      ],
      [
        'Can you maintain a website or app?',
        'Yes. Flexible maintenance plans keep digital products secure and up to date.',
      ],
    ];
    final list = List.generate(
      questions.length,
      (i) => _faq(i, questions[i][0], questions[i][1]),
    );
    return Padding(
      padding: const EdgeInsets.all(24),
      child: mobile
          ? Column(children: list)
          : Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(child: Column(children: list.take(4).toList())),
                const SizedBox(width: 16),
                Expanded(child: Column(children: list.skip(4).toList())),
              ],
            ),
    );
  }

  Widget _faq(int index, String question, String answer) {
    final isOpen = openFaq == index;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => setState(() => openFaq = isOpen ? -1 : index),
        child: GlassPanel(
          radius: 16,
          padding: const EdgeInsets.all(22),
          child: Column(
            children: [
              Row(
                children: [
                  Text(
                    '0${index + 1}',
                    style: const TextStyle(
                      color: lime,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Text(
                      question,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Icon(isOpen ? Icons.close : Icons.add, color: Colors.white),
                ],
              ),
              if (isOpen)
                Padding(
                  padding: const EdgeInsets.only(left: 48, top: 16),
                  child: Text(
                    answer,
                    style: const TextStyle(
                      color: Color(0xFFC8C8C8),
                      height: 1.5,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _contact(bool mobile) => Column(
    children: [
      Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 95),
        color: Colors.black.withValues(alpha: .28),
        child: Column(
          children: [
            const _Mark(size: 62),
            const SizedBox(height: 25),
            const Text(
              'Thank you for your Interest in Blaze Byte.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: 30,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Tell us about your project and let us explore what we can build together.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Color(0xFFC8C8C8)),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () {},
              style: _primaryStyle(),
              child: const Text('Start Project'),
            ),
          ],
        ),
      ),
      Padding(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1050),
          child: GlassPanel(
            radius: 20,
            padding: const EdgeInsets.all(32),
            child: Column(
              children: [
                mobile
                    ? Column(
                        children: [
                          _input(
                            'Full Name',
                            'Your Name',
                            controller: nameController,
                          ),
                          const SizedBox(height: 18),
                          _input(
                            'Email',
                            'Your Email',
                            controller: emailController,
                          ),
                        ],
                      )
                    : Row(
                        children: [
                          Expanded(
                            child: _input(
                              'Full Name',
                              'Your Name',
                              controller: nameController,
                            ),
                          ),
                          const SizedBox(width: 22),
                          Expanded(
                            child: _input(
                              'Email',
                              'Your Email',
                              controller: emailController,
                            ),
                          ),
                        ],
                      ),
                const SizedBox(height: 22),
                _input(
                  'Your Message',
                  'Tell us more about your project',
                  controller: messageController,
                  lines: 4,
                ),
                const SizedBox(height: 22),
                Row(
                  children: [
                    const Text(
                      'Your Budget',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      '\$${budget.round()}',
                      style: const TextStyle(
                        color: lime,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Slider(
                  value: budget,
                  min: 1000,
                  max: 10000,
                  activeColor: purple,
                  inactiveColor: Colors.white24,
                  onChanged: (x) => setState(() => budget = x),
                ),
                FilledButton(
                  onPressed: sendOrderEmail,
                  style: _primaryStyle(),
                  child: const Text('Submit Order'),
                ),
              ],
            ),
          ),
        ),
      ),
    ],
  );

  Widget _input(
    String label,
    String hint, {
    int lines = 1,
    required TextEditingController controller,
  }) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
      const SizedBox(height: 10),
      TextField(
        controller: controller,
        maxLines: lines,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.white38),
          filled: true,
          fillColor: Colors.white.withValues(alpha: .06),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(color: Colors.white.withValues(alpha: .12)),
          ),
        ),
      ),
    ],
  );

  Widget footer(bool mobile) => Padding(
    padding: const EdgeInsets.all(28),
    child: Column(
      children: [
        _logo(),
        const SizedBox(height: 25),
        const Wrap(
          alignment: WrapAlignment.center,
          spacing: 22,
          runSpacing: 12,
          children: [
            Text('Home', style: TextStyle(color: Color(0xFFC8C8C8))),
            Text('Services', style: TextStyle(color: Color(0xFFC8C8C8))),
            Text('Why', style: TextStyle(color: Color(0xFFC8C8C8))),
            Text('Contact', style: TextStyle(color: Color(0xFFC8C8C8))),
          ],
        ),
        const SizedBox(height: 28),
        Divider(color: Colors.white.withValues(alpha: .12)),
        const SizedBox(height: 20),
        const Text(
          '© 2026 Blaze Byte Studio · Building digital products that work.',
          style: TextStyle(color: Color(0xFF999999), fontSize: 11),
        ),
      ],
    ),
  );

  ButtonStyle _primaryStyle() => FilledButton.styleFrom(
    backgroundColor: purple,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 15),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(7)),
  );
}

class GlassPanel extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final double radius;
  const GlassPanel({
    super.key,
    required this.child,
    required this.padding,
    this.radius = 18,
  });
  @override
  Widget build(BuildContext context) => ClipRRect(
    borderRadius: BorderRadius.circular(radius),
    child: BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
      child: Container(
        padding: padding,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: .07),
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(color: Colors.white.withValues(alpha: .16)),
        ),
        child: child,
      ),
    ),
  );
}

class _Mark extends StatelessWidget {
  final double size;
  const _Mark({this.size = 36});
  @override
  Widget build(BuildContext context) => Container(
    width: size,
    height: size,
    decoration: BoxDecoration(
      color: const Color(0xFF7025ED),
      borderRadius: BorderRadius.circular(size * .18),
    ),
    child: Icon(Icons.bolt, color: Colors.black, size: size * .58),
  );
}

class ChipGlass extends StatelessWidget {
  final String text;
  const ChipGlass(this.text, {super.key});
  @override
  Widget build(BuildContext context) => GlassPanel(
    radius: 7,
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
    child: Text(
      text,
      style: const TextStyle(color: Color(0xFFE0E0E0), fontSize: 11),
    ),
  );
}

class _Info {
  final IconData icon;
  final String title, text;
  const _Info(this.icon, this.title, this.text);
}

class ServiceCard extends StatelessWidget {
  final _Info info;
  const ServiceCard({super.key, required this.info});
  @override
  Widget build(BuildContext context) => GlassPanel(
    padding: const EdgeInsets.all(28),
    child: SizedBox(
      height: 305,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 62,
            height: 62,
            decoration: BoxDecoration(
              color: const Color(0xFFA8FF18).withValues(alpha: .12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(info.icon, color: const Color(0xFFA8FF18), size: 32),
          ),
          const SizedBox(height: 24),
          Text(
            info.title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            info.text,
            style: const TextStyle(color: Color(0xFFC8C8C8), height: 1.5),
          ),
          const Spacer(),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: BorderSide(color: Colors.white.withValues(alpha: .18)),
              ),
              child: const Text('Learn More'),
            ),
          ),
        ],
      ),
    ),
  );
}

class FeatureCard extends StatelessWidget {
  final _Info info;
  const FeatureCard({super.key, required this.info});
  @override
  Widget build(BuildContext context) => GlassPanel(
    padding: const EdgeInsets.all(28),
    child: SizedBox(
      height: 210,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(info.icon, color: const Color(0xFFA8FF18), size: 31),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  info.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 19,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 25),
          Text(
            info.text,
            style: const TextStyle(color: Color(0xFFC8C8C8), height: 1.5),
          ),
        ],
      ),
    ),
  );
}

class TestimonialCard extends StatelessWidget {
  final List<String> data;
  const TestimonialCard({super.key, required this.data});
  @override
  Widget build(BuildContext context) => GlassPanel(
    padding: const EdgeInsets.all(28),
    child: SizedBox(
      height: 330,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            data[0],
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              height: 1.2,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 18),
          Text(
            data[1],
            style: const TextStyle(color: Color(0xFFC8C8C8), height: 1.5),
          ),
          const Spacer(),
          Row(
            children: [
              const CircleAvatar(
                backgroundColor: Color(0xFFA8FF18),
                child: Icon(Icons.person, color: Colors.black),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    data[2],
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    data[3],
                    style: const TextStyle(
                      color: Color(0xFFAAAAAA),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ),
  );
}
