import { Button, Container, Input } from "@/components";
import { Text, Label, Heading, Span } from "@/features/typography";

function Menu() {
  return (
    <Container className="flex h-screen flex-col items-center justify-center gap-32">
      <div>
        <Heading level={1} size="5xl" className="sm:text-6xl" align="center">
          H1 Headline
        </Heading>
        <Text isSubText align="center" className="mt-2">
          Lorem ipsum dolor sit amet.
        </Text>
      </div>

      <div className="w-full sm:max-w-96">
        <Label className="flex flex-col">
          Enter code
          <Input type="text" />
        </Label>
        <Button fullwidth className="mt-4">
          Join Game
        </Button>
        <div className="my-8 flex items-center justify-center">
          <div className="h-[2px] w-28 bg-gray-300" />
          <Span isSubText className="mx-2">
            or
          </Span>
          <div className="h-[2px] w-28 bg-gray-300" />
        </div>
        <Button fullwidth>Create Game</Button>
      </div>
    </Container>
  );
}

export default Menu;
